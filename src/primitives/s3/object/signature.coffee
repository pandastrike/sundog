# Signing a URL grants the bearer the ability to perform the given action against an S3 object, even if they are not you.

Section = (s3) ->

  sign = (action, parameters) ->
    await s3.getSignedUrl action, parameters

  signPost = (parameters) ->
    await s3.createPresignedPost parameters

  {sign, signPost}

export default Section
