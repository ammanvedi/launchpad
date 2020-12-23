# Lambda
Custom functionality supporting AWS services created by Terraform

## NPM Scripts
`npm run build` - build the Lambda functions into zipped archives with webpack

## Adding a New Lambda
in order to define a new lambda just create a new typescript file in `src` and then update `webpack.config.js` with the new entry point this will compile the new code compress it into a zip archive and place it in the dist directory ready for upload either through terraform or however you please

You can see an example of this in terraform in `packages/terraform/auth/main.tf` in the `custom_message_lambda` resource.
