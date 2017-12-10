# sundog
Wrapper for the JavaScript AWS SDK, powered by Fairmont to give it a functional boost

## API
SunDog's API is divided into three pillars:

### Lifted AWS SDK, `_AWS`
This collection is the raw SDK methods lifted from the original object.  This frees them from the callback structure and wraps them in promises that we can `await` on.  This will always have the most detailed API because we can lift them programmatically with just a little code.

### AWS "Primitives", `AWS`
This collection is filled with relatively simple convenience methods that wrap a given AWS method.  For example, `S3.putObject` is wrapped by `put(bucketName, key, content, options)`.  This is curried, easier to compose, and easier to work with than its object-oriented ancestor.  This collection will slowly build as we have more need to write more wrappers.

### AWS Helpers, `Helpers`
This is an class-based collection built on top of the AWS Primitives collection.  There is a tension between functional and object-oriented styles.  Functional forms are easier to compose, but it can be useful to map class structures to entities.  SunDog uses both to achieve expressive power in this pillar.  For example, `Bucket` is an instantiated collection of S3 "Primitives" curried on the bucket name.  This organization also lets us compose novel functionality, like `Bucket::selfDestruct()`.  This deletes a bucket and takes care of emptying for you, first.  We can compose the functionality not provided directly by AWS and make it available in a portable form.
