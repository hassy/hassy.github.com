---
layout: post
title: Using KMS to encrypt sensitive data (and using it for Serverless secrets)
---

# Using KMS to encrypt sensitive data (and using it for Serverless secrets)

[`kms-vault`](https://gist.github.com/hassy/96256cfde707fed40714c02b64f8049e) is a tiny shell script that can be used to encrypt sensitive data such as passwords or private keys using a master key from [AWS KMS](https://aws.amazon.com/kms/).

## Using `kms-vault`

First, download the shell scripts and put it somewhere in your `$PATH`.

To encrypt a text file:

```shell
#
# My-KMS-Key is a key you created in KMS, see:
# http://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html
#
kms-vault encrypt My-KMS-Key private_key.pem > private_key.pem.encrypted
```

To decrypt an encrypted file:

```shell
#
# We don't need to specify the name of the key here because that information is 
# stored in the metadata in the encrypted blob of data:
#
kms-vault decrypt private_key.pem.encrypted
```

(It goes without saying that if you [delete the master key](http://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html) that was used to encrypt a file, you won't be able to recover the plaintext.)

## Why KMS?

1. If you create an [AWS-managed master key](http://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#master_keys), it never leaves AWS. That's one less thing for you to worry about protecting.
2. All the usual [IAM](https://aws.amazon.com/iam/) facilites can used for access control with all of its power and flexibility.

The combination of 1 & 2 makes `kms-vault` very handy for storing all kinds of secrets inside git repos for example. There's no need to share a password as is the case with [`ansible-vault`](http://docs.ansible.com/ansible/latest/playbooks_vault.html), and access to keys can be controlled with IAM policies on AWS accounts of other members of your team.

Finally, AWS Lambda integrates with KMS, which makes `kms-vault` a nice simple solution for managing secrets in [Serverless-based](https://serverless.com/) projects (this is reason I whipped up `kms-vault` in the first place).
