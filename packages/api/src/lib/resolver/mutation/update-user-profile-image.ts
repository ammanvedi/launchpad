import {GqlError, MutationResolvers, Role} from "../../../generated/graphql";
import {GQLContext} from "../../context/context";
import {createLoggerSet} from "../../logging/logger";

const log = createLoggerSet('updateUserProfileImageResolverLogger')

export const updateUserProfileImageResolver: MutationResolvers<GQLContext>['updateUserProfileImage'] =
    async (parent, {file}, {mediaManager, authState, data}) => {

    const { filename, createReadStream } = await file;

    let tempFilePath: string | null = null;
    let finalPath: string | null = null;
    try {
        log.info('Writing to temp directory');
        tempFilePath = await mediaManager.writeStreamToTempDirectory(createReadStream(), filename);

        log.info('Store image');
        finalPath = await mediaManager.storeImage(tempFilePath);

        log.info('Delete image from local filesystem');
        await mediaManager.removeFileFromTempDirectory(tempFilePath);

        log.info('Setting user image in database');
        const updatedUser = await data.db.user.update({
            where: {
                id: authState.id
            },
            data: {
                profileImage: finalPath,
                consents: {}
            }
        });
        /**
         * since we get the updated data here anyway we may as well prime the
         * data-loader cache so that we dont have to do another fetch to the database
         * later if the user requests more fields than we return from this resolver
         */
        data.loaders.user.byId.prime(authState.id, updatedUser);
    } catch (e) {
        log.err('Failed to upload the file');
        log.err(e.toSrting());
        throw new Error(GqlError.UploadFailed);
    }

    return {
        id: authState.id,
        email: authState.email,
        role: authState.role as Role,
        profileImage: finalPath,
    }
}