0003 Migrate NPM packages to @2uinc scope
==========================================

Status
------

Accepted

Context
-------

The enterprise team within 2U is working on ENT-11239 to migrate all enterprise
repos from the ``openedx`` GitHub org into forks within the ``edx`` GitHub org.

The ``frontend-enterprise`` monorepo was originally hosted at
``openedx/frontend-enterprise`` on GitHub, and its packages were published to NPM
under the ``@edx/`` scope:

* ``@edx/frontend-enterprise-catalog-search``
* ``@edx/frontend-enterprise-logistration``
* ``@edx/frontend-enterprise-utils``
* ``@edx/frontend-enterprise-hotjar``

The repository has been forked to ``edx/frontend-enterprise``. The new fork needs
its own NPM scope to publish packages independently from the upstream repository
and avoid version conflicts.

Decision
--------

All packages in this monorepo are now published under the ``@2uinc/`` NPM scope:

* ``@2uinc/frontend-enterprise-catalog-search``
* ``@2uinc/frontend-enterprise-logistration``
* ``@2uinc/frontend-enterprise-utils``
* ``@2uinc/frontend-enterprise-hotjar``

All internal cross-package references (imports, dependencies, configuration
patterns) have been updated accordingly. External dependencies (e.g.,
``@edx/frontend-platform``, ``@edx/browserslist-config``) remain unchanged, as
the focus of this migration is only 2U-specific.

Consequences
------------

* Consuming applications within 2U must update their dependencies from
  ``@edx/frontend-enterprise-*`` to ``@2uinc/frontend-enterprise-*``.
* The ``@edx/``-scoped versions of these packages will no longer receive
  updates directly from 2U developers.
