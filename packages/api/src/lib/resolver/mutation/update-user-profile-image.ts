import {MutationResolvers, Role} from "../../../generated/graphql";
import {GQLContext} from "../../context/context";

export const updateUserProfileImageResolver: MutationResolvers<GQLContext>['updateUserProfileImage'] =
    async (parent, {file}, context, info) => {

    const { filename, mimetype, encoding, createReadStream } = await file;

        /**
         * save imagento local file
         * upload to cloudinary
         * delete local file
         */

    const stream = createReadStream();

    console.log(file)

    return {
        id: context.authState.id,
        email: context.authState.email,
        role: context.authState.role as Role
    }
}