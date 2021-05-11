Resolving publishing issues with Lerna
################################

In setting up the Lerna monorepo, there was a moment when the ``lerna publish`` command (via ``npm run publish``) had successfully created git tags and commited a "chore: publish" commit for a new release, but failed to publish that new release to NPM.

The result of this publishing failure was that the Git repository was in a state as if the release had been published, without the same, matching version existing on the NPM registry. This document serves as a starting point to resolve that situation.

In the scenario where Git tags and a "chore: publish" commit were created for a new release without that release actually being published to NPM, you may temporarily modify the ``release.yml`` Github Action workflow file to run the following command instead of the default ``lerna publish`` (via ``npm run publish``):

::

  lerna publish from-package --no-git-tag-version --no-push --yes

By including the ``from-package`` option, Lerna will determine the package version to publish based on the existing version noted in the package.json files of each package in the monorepo. The ``--no-git-tag-version`` option tells Lerna to not attempt to create new Git tags for this release, because in this scenario, they were already created. The ``--no-push`` option tells Lerna to avoid creating a new "chore: publish" commit.

See the `official Lerna documentation <https://github.com/lerna/lerna/tree/main/commands/publish#readme>`_ for more details.

Be sure to remember reverting the ``release.yml`` back to its original state of running ``npm run publish`` once the published NPM packages are back in a good state with matching versions.