#!/bin/sh

aws cognito-idp add-custom-attributes \
--user-pool-id $AWS_USER_POOL_ID \
--custom-attributes \
'[
  {
    "Name": "string",
    "AttributeDataType": "String",
    "DeveloperOnlyAttribute": true|false,
    "Mutable": true|false,
    "Required": true|false,
    "NumberAttributeConstraints": {
      "MinValue": "string",
      "MaxValue": "string"
    },
    "StringAttributeConstraints": {
      "MinLength": "string",
      "MaxLength": "string"
    }
  }
  ...
]'