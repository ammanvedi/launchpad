setup a s3 bucket to store your s3 configs

https://www.terraform.io/docs/backends/types/s3.html

make sure you have the correct permissions

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::mybucket"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::mybucket/path/to/my/key"
    }
  ]
}
```


this setup does not LOCK STSTAE

https://www.terraform.io/docs/state/locking.html

you should also update the backend configs in each environment as terraform does nto allow you to
set these up with envars so youll have to do it manually
