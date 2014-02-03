/*global define*/
define(function () {
  'use strict';

  return {
    'defines': {
      'constants': {
        'name': 'Github',
        'description': 'A Node.JS module, which provides an object oriented wrapper for the GitHub v3 API.',
        'protocol': 'https',
        'host': 'api.github.com',
        'port': 443,
        'dateFormat': 'YYYY-MM-DDTHH:MM:SSZ',
        'requestFormat': 'json'
      },
      'response-headers': [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-Oauth-Scopes',
        'Link',
        'Location',
        'Last-Modified',
        'Etag',
        'Status'
      ],
      'request-headers': [
        'If-Modified-Since',
        'If-None-Match',
        'Cookie',
        'User-Agent'
      ],
      'params': {
        'files': {
          'type': 'Json',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': 'Files that make up this gist. The key of which should be a required string filename and the value another required hash with parameters: \'content\''
        },
        'user': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'org': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'repo': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'branch': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'sha': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'description': {
          'type': 'String',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'id': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'ref': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': 'String of the name of the fully qualified reference (ie: heads/master). If it doesn’t have at least one slash, it will be rejected.'
        },
        'number': {
          'type': 'Number',
          'required': true,
          'validation': '^[0-9]+$',
          'invalidmsg': '',
          'description': ''
        },
        'name': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'direction': {
          'type': 'String',
          'required': false,
          'validation': '^(asc|desc)$',
          'invalidmsg': 'asc or desc, default: desc.',
          'description': ''
        },
        'since': {
          'type': 'Date',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional string of a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ'
        },
        'state': {
          'type': 'String',
          'required': false,
          'validation': '^(open|closed)$',
          'invalidmsg': 'open, closed, default: open',
          'description': ''
        },
        'color': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': 'Required string - 6 character hex code, without a leading #.',
          'description': 'Required string - 6 character hex code, without a leading #.'
        },
        'permission': {
          'type': 'String',
          'required': false,
          'validation': '^(pull|push|admin)$',
          'invalidmsg': '',
          'description': '`pull` - team members can pull, but not push or administer this repositories (Default), `push` - team members can pull and push, but not administer this repositores, `admin` - team members can pull, push and administer these repositories.'
        },
        'base': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': 'Required string - The branch (or git ref) you want your changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repo that requests a merge to a base of another repo.'
        },
        'head': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': 'Required string - The branch (or git ref) where your changes are implemented.'
        },
        'commit_id': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': 'Required string - Sha of the commit to comment on.',
          'description': 'Required string - Sha of the commit to comment on.'
        },
        'line': {
          'type': 'Number',
          'required': true,
          'validation': '',
          'invalidmsg': 'Required number - Line index in the diff to comment on.',
          'description': 'Required number - Line index in the diff to comment on.'
        },
        'path': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': 'Required string - Relative path of the file to comment on.',
          'description': 'Required string - Relative path of the file to comment on.'
        },
        'position': {
          'type': 'Number',
          'required': true,
          'validation': '',
          'invalidmsg': 'Required number - Column index in the diff to comment on.',
          'description': 'Required number - Column index in the diff to comment on.'
        },
        'body': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'homepage': {
          'type': 'String',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'private': {
          'type': 'Boolean',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional boolean - true to create a private repository, false to create a public one. Creating private repositories requires a paid GitHub account. Default is false.'
        },
        'has_issues': {
          'type': 'Boolean',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional boolean - true to enable issues for this repository, false to disable them. Default is true.'
        },
        'has_wiki': {
          'type': 'Boolean',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional boolean - true to enable the wiki for this repository, false to disable it. Default is true.'
        },
        'has_downloads': {
          'type': 'Boolean',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional boolean - true to enable downloads for this repository, false to disable them. Default is true.'
        },
        'collabuser': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'title': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'key': {
          'type': 'String',
          'required': true,
          'validation': '',
          'invalidmsg': '',
          'description': ''
        },
        'page': {
          'type': 'Number',
          'required': false,
          'validation': '^[0-9]+$',
          'invalidmsg': '',
          'description': 'Page number of the results to fetch.'
        },
        'per_page': {
          'type': 'Number',
          'required': false,
          'validation': '^[0-9]+$',
          'invalidmsg': '',
          'description': 'A custom page size up to 100. Default is 30.'
        },
        'scopes': {
          'type': 'Array',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional array - A list of scopes that this authorization is in.'
        },
        'note': {
          'type': 'String',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional string - A note to remind you what the OAuth token is for.'
        },
        'note_url': {
          'type': 'String',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional string - A URL to remind you what app the OAuth token is for.'
        },
        'auto_init': {
          'type': 'Boolean',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional boolean - true to create an initial commit with empty README. Default is false'
        },
        'gitignore_template': {
          'type': 'String',
          'required': false,
          'validation': '',
          'invalidmsg': '',
          'description': 'Optional string - Desired language or platform .gitignore template to apply. Ignored if auto_init parameter is not provided.'
        }
      }
    },

    'gists': {
      'get-all': {
        'url': '/gists',
        'method': 'GET',
        'params': {
          '$page': null,
          '$per_page': null,
          '$since': null
        }
      },

      'get-from-user': {
        'url': '/users/:user/gists',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null,
          '$since': null
        }
      },

      'create': {
        'url': '/gists',
        'method': 'POST',
        'params': {
          '$description': null,
          'public': {
            'type': 'Boolean',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          '$files': null
        }
      },

      'edit': {
        'url': '/gists/:id',
        'method': 'PATCH',
        'params': {
          '$id': null,
          '$description': null,
          '$files': null
        }
      },

      'public': {
        'url': '/gists/public',
        'method': 'GET',
        'params': {
          '$since': null
        }
      },

      'starred': {
        'url': '/gists/starred',
        'method': 'GET',
        'params': {
          '$since': null
        }
      },

      'get': {
        'url': '/gists/:id',
        'method': 'GET',
        'params': {
          '$id': null
        }
      },

      'star': {
        'url': '/gists/:id/star',
        'method': 'PUT',
        'params': {
          '$id': null
        }
      },

      'delete-star': {
        'url': '/gists/:id/star',
        'method': 'DELETE',
        'params': {
          '$id': null
        }
      },

      'check-star': {
        'url': '/gists/:id/star',
        'method': 'GET',
        'params': {
          '$id': null
        }
      },

      'fork': {
        'url': '/gists/:id/fork',
        'method': 'POST',
        'params': {
          '$id': null
        }
      },

      'delete': {
        'url': '/gists/:id',
        'method': 'DELETE',
        'params': {
          '$id': null
        }
      }
    },

    'gitdata': {
      'get-blob': {
        'url': '/repos/:user/:repo/git/blobs/:sha',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$sha': null,
          '$page': null,
          '$per_page': null
        }
      },

      'create-blob': {
        'url': '/repos/:user/:repo/git/blobs',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          'content': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'encoding': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          }
        }
      },

      'get-commit': {
        'url': '/repos/:user/:repo/git/commits/:sha',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$sha': null
        }
      },

      'create-commit': {
        'url': '/repos/:user/:repo/git/commits',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          'message': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'String of the commit message'
          },
          'tree': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'String of the SHA of the tree object this commit points to'
          },
          'parents': {
            'type': 'Array',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Array of the SHAs of the commits that were the parents of this commit. If omitted or empty, the commit will be written as a root commit. For a single parent, an array of one SHA should be provided, for a merge commit, an array of more than one should be provided.'
          },
          'author': {
            'type': 'Json',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'committer': {
            'type': 'Json',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          }
        }
      },

      'get-reference': {
        'url': '/repos/:user/:repo/git/refs/:ref',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$ref': null
        }
      },

      'get-all-references': {
        'url': '/repos/:user/:repo/git/refs',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'create-reference': {
        'url': '/repos/:user/:repo/git/refs',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$ref': null,
          '$sha': null
        }
      },

      'update-reference': {
        'url': '/repos/:user/:repo/git/refs/:ref',
        'method': 'PATCH',
        'params': {
          '$user': null,
          '$repo': null,
          '$ref': null,
          '$sha': null,
          'force': {
            'type': 'Boolean',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Boolean indicating whether to force the update or to make sure the update is a fast-forward update. The default is false, so leaving this out or setting it to false will make sure you’re not overwriting work.'
          }
        }
      },

      'delete-reference': {
        'url': '/repos/:user/:repo/git/refs/:ref',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$ref': null
        }
      },

      'get-tag': {
        'url': '/repos/:user/:repo/git/tags/:sha',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$sha': null
        }
      },

      'create-tag': {
        'url': '/repos/:user/:repo/git/tags',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          'tag': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'String of the tag'
          },
          'message': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'String of the tag message'
          },
          'object': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'String of the SHA of the git object this is tagging'
          },
          'type': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'String of the type of the object we’re tagging. Normally this is a commit but it can also be a tree or a blob.'
          },
          'tagger': {
            'type': 'Json',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'JSON object that contains the following keys: `name` - String of the name of the author of the tag, `email` - String of the email of the author of the tag, `date` - Timestamp of when this object was tagged'
          }
        }
      },

      'get-tree': {
        'url': '/repos/:user/:repo/git/trees/:sha',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$sha': null,
          'recursive': {
            'type': 'Boolean',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          }
        }
      },

      'create-tree': {
        'url': '/repos/:user/:repo/git/trees',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          'tree': {
            'type': 'Json',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Array of Hash objects (of path, mode, type and sha) specifying a tree structure'
          },
          'base_tree': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'String of the SHA1 of the tree you want to update with new data'
          }
        }
      }
    },

    'issues': {
      'get-all': {
        'url': '/issues',
        'method': 'GET',
        'params': {
          'filter': {
            'type': 'String',
            'required': false,
            'validation': '^(all|assigned|created|mentioned|subscribed)$',
            'invalidmsg': '',
            'description': ''
          },
          '$state': null,
          'labels': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'String list of comma separated Label names. Example: bug,ui,@high'
          },
          'sort': {
            'type': 'String',
            'required': false,
            'validation': '^(created|updated|comments)$',
            'invalidmsg': 'created, updated, comments, default: created.',
            'description': ''
          },
          '$direction': null,
          '$since': null,
          '$page': null,
          '$per_page': null
        }
      },

      'repo-issues': {
        'url': '/repos/:user/:repo/issues',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          'milestone': {
            'type': 'String',
            'required': false,
            'validation': '^([0-9]+|none|\\*)$',
            'invalidmsg': '',
            'description': ''
          },
          'state': {
            'type': 'String',
            'required': false,
            'validation': '^(open|closed)$',
            'invalidmsg': 'open, closed, default: open',
            'description': 'open or closed'
          },
          'assignee': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': 'String User login, `none` for Issues with no assigned User. `*` for Issues with any assigned User.',
            'description': 'String User login, `none` for Issues with no assigned User. `*` for Issues with any assigned User.'
          },
          'mentioned': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'String User login.'
          },
          'labels': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'String list of comma separated Label names. Example: bug,ui,@high'
          },
          'sort': {
            'type': 'String',
            'required': false,
            'validation': '^(created|updated|comments)$',
            'invalidmsg': 'created, updated, comments, default: created.',
            'description': ''
          },
          '$direction': null,
          '$since': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-repo-issue': {
        'url': '/repos/:user/:repo/issues/:number',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null
        }
      },

      'create': {
        'url': '/repos/:user/:repo/issues',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          'title': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'body': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'assignee': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional string - Login for the user that this issue should be assigned to.'
          },
          'milestone': {
            'type': 'Number',
            'required': false,
            'validation': '^[0-9]+$',
            'invalidmsg': '',
            'description': 'Optional number - Milestone to associate this issue with.'
          },
          'labels': {
            'type': 'Json',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional array of strings - Labels to associate with this issue.'
          }
        }
      },

      'edit': {
        'url': '/repos/:user/:repo/issues/:number',
        'method': 'PATCH',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          'title': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'body': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'assignee': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional string - Login for the user that this issue should be assigned to.'
          },
          'milestone': {
            'type': 'Number',
            'required': false,
            'validation': '^[0-9]+$',
            'invalidmsg': '',
            'description': 'Optional number - Milestone to associate this issue with.'
          },
          'labels': {
            'type': 'Json',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional array of strings - Labels to associate with this issue.'
          },
          'state': {
            'type': 'String',
            'required': false,
            'validation': '^(open|closed)$',
            'invalidmsg': 'open, closed, default: open',
            'description': 'open or closed'
          }
        }
      },

      'repo-comments': {
        'url': '/repos/:user/:repo/issues/comments',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          'sort': {
            'type': 'String',
            'required': false,
            'validation': '^(created|updated)$',
            'invalidmsg': 'created, updated, default: created.',
            'description': ''
          },
          '$direction': null,
          '$since': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-comments': {
        'url': '/repos/:user/:repo/issues/:number/comments',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-comment': {
        'url': '/repos/:user/:repo/issues/comments/:id',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'create-comment': {
        'url': '/repos/:user/:repo/issues/:number/comments',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          'body': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          }
        }
      },

      'edit-comment': {
        'url': '/repos/:user/:repo/issues/comments/:id',
        'method': 'PATCH',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null,
          'body': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          }
        }
      },

      'delete-comment': {
        'url': '/repos/:user/:repo/issues/comments/:id',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'get-events': {
        'url': '/repos/:user/:repo/issues/:number/events',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-repo-events': {
        'url': '/repos/:user/:repo/issues/events',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-event': {
        'url': '/repos/:user/:repo/issues/events/:id',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'get-labels': {
        'url': '/repos/:user/:repo/labels',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null
        }
      },

      'get-label': {
        'url': '/repos/:user/:repo/labels/:name',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$name': null
        }
      },

      'create-label': {
        'url': '/repos/:user/:repo/labels',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$name': null,
          '$color': null
        }
      },

      'update-label': {
        'url': '/repos/:user/:repo/labels/:name',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$name': null,
          '$color': null
        }
      },

      'delete-label': {
        'url': '/repos/:user/:repo/labels/:name',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$name': null
        }
      },

      'get-all-milestones': {
        'url': '/repos/:user/:repo/milestones',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$state': null,
          'sort': {
            'type': 'String',
            'required': false,
            'validation': '^(due_date|completeness)$',
            'invalidmsg': 'due_date, completeness, default: due_date',
            'description': 'due_date, completeness, default: due_date'
          },
          '$page': null,
          '$per_page': null
        }
      },

      'get-milestone': {
        'url': '/repos/:user/:repo/milestones/:number',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null
        }
      },

      'create-milestone': {
        'url': '/repos/:user/:repo/milestones',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          'title': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          '$state': null,
          '$description': null,
          'due_on': {
            'type': 'Date',
            'required': false,
            'validation': '',
            'invalidmsg': 'Optional string - ISO 8601 time.',
            'description': 'Optional string - ISO 8601 time.'
          }
        }
      },

      'update-milestone': {
        'url': '/repos/:user/:repo/milestones/:number',
        'method': 'PATCH',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          'title': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          '$state': null,
          '$description': null,
          'due_on': {
            'type': 'Date',
            'required': false,
            'validation': '',
            'invalidmsg': 'Optional string - ISO 8601 time.',
            'description': 'Optional string - ISO 8601 time.'
          }
        }
      },

      'delete-milestone': {
        'url': '/repos/:user/:repo/milestones/:number',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null
        }
      }
    },

    'authorization': {
      'get-all': {
        'url': '/authorizations',
        'method': 'GET',
        'params': {
          '$page': null,
          '$per_page': null
        }
      },
      'get': {
        'url': '/authorizations/:id',
        'method': 'GET',
        'params': {
          '$id': null
        }
      },
      'create': {
        'url': '/authorizations',
        'method': 'POST',
        'params': {
          '$scopes': null,
          '$note': null,
          '$note_url': null
        }
      },
      'update': {
        'url': '/authorizations/:id',
        'method': 'PATCH',
        'params': {
          '$id': null,
          '$scopes': null,
          'add_scopes': {
            'type': 'Array',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional array - A list of scopes to add to this authorization.'
          },
          'remove_scopes': {
            'type': 'Array',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional array - A list of scopes to remove from this authorization.'
          },
          '$note': null,
          '$note_url': null
        }
      },
      'delete': {
        'url': '/authorizations/:id',
        'method': 'DELETE',
        'params': {
          '$id': null
        }
      }
    },

    'orgs': {
      'get-from-user': {
        'url': '/users/:user/orgs',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get': {
        'url': '/orgs/:org',
        'method': 'GET',
        'params': {
          '$org': null,
          '$page': null,
          '$per_page': null
        }
      },

      'update': {
        'url': '/orgs/:org',
        'method': 'PATCH',
        'params': {
          '$org': null,
          'billing_email': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional string - Billing email address. This address is not publicized.'
          },
          'company': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'email': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional string - Publicly visible email address.'
          },
          'location': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'name': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          }
        }
      },

      'get-members': {
        'url': '/orgs/:org/members',
        'method': 'GET',
        'params': {
          '$org': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-member': {
        'url': '/orgs/:org/members/:user',
        'method': 'GET',
        'params': {
          '$org': null,
          '$user': null
        }
      },

      'remove-member': {
        'url': '/orgs/:org/members/:user',
        'method': 'DELETE',
        'params': {
          '$org': null,
          '$user': null
        }
      },

      'get-public-members': {
        'url': '/orgs/:org/public_members',
        'method': 'GET',
        'params': {
          '$org': null
        }
      },

      'get-public-member': {
        'url': '/orgs/:org/public_members/:user',
        'method': 'GET',
        'params': {
          '$org': null,
          '$user': null
        }
      },

      'publicize-membership': {
        'url': '/orgs/:org/public_members/:user',
        'method': 'PUT',
        'params': {
          '$org': null,
          '$user': null
        }
      },

      'conceal-membership': {
        'url': '/orgs/:org/public_members/:user',
        'method': 'DELETE',
        'params': {
          '$org': null,
          '$user': null
        }
      },

      'get-teams': {
        'url': '/orgs/:org/teams',
        'method': 'GET',
        'params': {
          '$org': null
        }
      },

      'get-team': {
        'url': '/teams/:id',
        'method': 'GET',
        'params': {
          '$id': null
        }
      },

      'create-team': {
        'url': '/orgs/:org/teams',
        'method': 'POST',
        'params': {
          '$org': null,
          '$name': null,
          'repo_names': {
            'type': 'Array',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional array of strings'
          },
          '$permission': null
        }
      },

      'update-team': {
        'url': '/teams/:id',
        'method': 'PATCH',
        'params': {
          '$id': null,
          '$name': null,
          '$permission': null
        }
      },

      'delete-team': {
        'url': '/teams/:id',
        'method': 'DELETE',
        'params': {
          '$id': null
        }
      },

      'get-team-members': {
        'url': '/teams/:id/members',
        'method': 'GET',
        'params': {
          '$id': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-team-member': {
        'url': '/teams/:id/members/:user',
        'method': 'GET',
        'params': {
          '$id': null,
          '$user': null
        }
      },

      'add-team-member': {
        'url': '/teams/:id/members/:user',
        'method': 'PUT',
        'params': {
          '$id': null,
          '$user': null
        }
      },

      'delete-team-member': {
        'url': '/teams/:id/members/:user',
        'method': 'DELETE',
        'params': {
          '$id': null,
          '$user': null
        }
      },

      'get-team-repos': {
        'url': '/teams/:id/repos',
        'method': 'GET',
        'params': {
          '$id': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-team-repo': {
        'url': '/teams/:id/repos/:user/:repo',
        'method': 'GET',
        'params': {
          '$id': null,
          '$user': null,
          '$repo': null
        }
      },

      'add-team-repo': {
        'url': '/teams/:id/repos/:user/:repo',
        'method': 'PUT',
        'params': {
          '$id': null,
          '$user': null,
          '$repo': null
        }
      },

      'delete-team-repo': {
        'url': '/teams/:id/repos/:user/:repo',
        'method': 'DELETE',
        'params': {
          '$id': null,
          '$user': null,
          '$repo': null
        }
      }
    },

    'statuses': {
      'get': {
        'url': '/repos/:user/:repo/statuses/:sha',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$sha': null
        }
      },

      'create': {
        'url': '/repos/:user/:repo/statuses/:sha',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$sha': null,
          'state': {
            'type': 'String',
            'required': true,
            'validation': '^(pending|success|error|failure)$',
            'invalidmsg': '',
            'description': 'State of the status - can be one of pending, success, error, or failure.'
          },
          'target_url': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Target url to associate with this status. This URL will be linked from the GitHub UI to allow users to easily see the ‘source’ of the Status.'
          },
          'description': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Short description of the status.'
          }
        }
      }
    },

    'pull-requests': {
      'get-all': {
        'url': '/repos/:user/:repo/pulls',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$state': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get': {
        'url': '/repos/:user/:repo/pulls/:number',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null
        }
      },

      'create': {
        'url': '/repos/:user/:repo/pulls',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          'title': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'body': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          '$base': null,
          '$head': null
        }
      },

      'create-from-issue': {
        'url': '/repos/:user/:repo/pulls',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          'issue': {
            'type': 'Number',
            'required': true,
            'validation': '^[0-9]+$',
            'invalidmsg': '',
            'description': ''
          },
          '$base': null,
          '$head': null
        }
      },

      'update': {
        'url': '/repos/:user/:repo/pulls/:number',
        'method': 'PATCH',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$state': null,
          'title': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'body': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          }
        }
      },

      'get-commits': {
        'url': '/repos/:user/:repo/pulls/:number/commits',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-files': {
        'url': '/repos/:user/:repo/pulls/:number/files',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-merged': {
        'url': '/repos/:user/:repo/pulls/:number/merge',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$page': null,
          '$per_page': null
        }
      },

      'merge': {
        'url': '/repos/:user/:repo/pulls/:number/merge',
        'method': 'PUT',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          'commit_message': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional string - The message that will be used for the merge commit'
          }
        }
      },

      'get-comments': {
        'url': '/repos/:user/:repo/pulls/:number/comments',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-comment': {
        'url': '/repos/:user/:repo/pulls/comments/:number',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null
        }
      },

      'create-comment': {
        'url': '/repos/:user/:repo/pulls/:number/comments',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$body': null,
          '$commit_id': null,
          '$path': null,
          '$position': null
        }
      },

      'create-comment-reply': {
        'url': '/repos/:user/:repo/pulls/:number/comments',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$body': null,
          'in_reply_to': {
            'type': 'Number',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          }
        }
      },

      'update-comment': {
        'url': '/repos/:user/:repo/pulls/comments/:number',
        'method': 'PATCH',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null,
          '$body': null
        }
      },

      'delete-comment': {
        'url': '/repos/:user/:repo/pulls/comments/:number',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$number': null
        }
      }
    },

    'repos': {
      'get-all': {
        'url': '/user/repos',
        'method': 'GET',
        'params': {
          'type': {
            'type': 'String',
            'required': false,
            'validation': '^(all|owner|public|private|member)$',
            'invalidmsg': 'Possible values: `all`, `owner`, `public`, `private`, `member`. Default: `all`.',
            'description': 'Possible values: `all`, `owner`, `public`, `private`, `member`. Default: `all`.'
          },
          'sort': {
            'type': 'String',
            'required': false,
            'validation': '^(created|updated|pushed|full_name)$',
            'invalidmsg': 'Possible values: `created`, `updated`, `pushed`, `full_name`. Default: `full_name`.',
            'description': 'Possible values: `created`, `updated`, `pushed`, `full_name`. Default: `full_name`.'
          },
          '$direction': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-from-user': {
        'url': '/users/:user/repos',
        'method': 'GET',
        'params': {
          '$user': null,
          'type': {
            'type': 'String',
            'required': false,
            'validation': '^(all|owner|member)$',
            'invalidmsg': 'Possible values: `all`, `owner`, `member`. Default: `public`.',
            'description': 'Possible values: `all`, `owner`, `member`. Default: `public`.'
          },
          'sort': {
            'type': 'String',
            'required': false,
            'validation': '^(created|updated|pushed|full_name)$',
            'invalidmsg': 'Possible values: `created`, `updated`, `pushed`, `full_name`. Default: `full_name`.',
            'description': 'Possible values: `created`, `updated`, `pushed`, `full_name`. Default: `full_name`.'
          },
          '$direction': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-from-org': {
        'url': '/orgs/:org/repos',
        'method': 'GET',
        'params': {
          '$org': null,
          'type': {
            'type': 'String',
            'required': false,
            'validation': '^(all|public|member)$',
            'invalidmsg': 'Possible values: `all`, `public`, `member`. Default: `all`.',
            'description': 'Possible values: `all`, `public`, `member`. Default: `all`.'
          },
          '$page': null,
          '$per_page': null
        }
      },

      'create': {
        'url': '/user/repos',
        'method': 'POST',
        'params': {
          '$name': null,
          '$description': null,
          '$homepage': null,
          '$private': null,
          '$has_issues': null,
          '$has_wiki': null,
          '$has_downloads': null,
          '$auto_init': null,
          '$gitignore_template': null
        }
      },

      'create-from-org': {
        'url': '/orgs/:org/repos',
        'method': 'POST',
        'params': {
          '$org': null,
          '$name': null,
          '$description': null,
          '$homepage': null,
          '$private': null,
          '$has_issues': null,
          '$has_wiki': null,
          '$has_downloads': null,
          '$auto_init': null,
          '$gitignore_template': null,
          'team_id': {
            'type': 'Number',
            'required': false,
            'validation': '^[0-9]+$',
            'invalidmsg': '',
            'description': 'Optional number - The id of the team that will be granted access to this repository. This is only valid when creating a repo in an organization.'
          }
        }
      },

      'get': {
        'url': '/repos/:user/:repo',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null
        }
      },

      'update': {
        'url': '/repos/:user/:repo',
        'method': 'PATCH',
        'params': {
          '$user': null,
          '$repo': null,
          '$name': null,
          '$description': null,
          '$homepage': null,
          '$private': null,
          '$has_issues': null,
          '$has_wiki': null,
          '$has_downloads': null
        }
      },

      'delete': {
        'url': '/repos/:user/:repo',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null
        }
      },

      'merge': {
        'url': '/repos/:user/:repo/merges',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$base': null,
          '$head': null,
          'commit_message': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional string - Commit message to use for the merge commit. If omitted, a default message will be used.'
          }
        }
      },

      'get-contributors': {
        'url': '/repos/:user/:repo/contributors',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          'anon': {
            'type': 'Boolean',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional flag. Set to 1 or true to include anonymous contributors in results.'
          },
          '$page': null,
          '$per_page': null
        }
      },

      'get-languages': {
        'url': '/repos/:user/:repo/languages',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-teams': {
        'url': '/repos/:user/:repo/teams',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-tags': {
        'url': '/repos/:user/:repo/tags',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-branches': {
        'url': '/repos/:user/:repo/branches',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-branch': {
        'url': '/repos/:user/:repo/branches/:branch',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$branch': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-collaborators': {
        'url': '/repos/:user/:repo/collaborators',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-collaborator': {
        'url': '/repos/:user/:repo/collaborators/:collabuser',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$collabuser': null
        }
      },

      'add-collaborator': {
        'url': '/repos/:user/:repo/collaborators/:collabuser',
        'method': 'PUT',
        'params': {
          '$user': null,
          '$repo': null,
          '$collabuser': null
        }
      },

      'remove-collaborator': {
        'url': '/repos/:user/:repo/collaborators/:collabuser',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$collabuser': null
        }
      },

      'get-commits': {
        'url': '/repos/:user/:repo/commits',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          'sha': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional string - Sha or branch to start listing commits from.'
          },
          'path': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional string - Only commits containing this file path will be returned.'
          },
          '$page': null,
          '$per_page': null,
          '$since': null
        }
      },

      'get-commit': {
        'url': '/repos/:user/:repo/commits/:sha',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$sha': null
        }
      },

      'get-all-commit-comments': {
        'url': '/repos/:user/:repo/comments',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-commit-comments': {
        'url': '/repos/:user/:repo/commits/:sha/comments',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$sha': null,
          '$page': null,
          '$per_page': null
        }
      },

      'create-commit-comment': {
        'url': '/repos/:user/:repo/commits/:sha/comments',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$sha': null,
          '$body': null,
          '$commit_id': null,
          'path': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional string - Relative path of the file to comment on.'
          },
          'position': {
            'type': 'Number',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional number - Line index in the diff to comment on.'
          },
          'line': {
            'type': 'Number',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional number - Line number in the file to comment on. Defaults to 1.'
          }
        }
      },

      'get-commit-comment': {
        'url': '/repos/:user/:repo/comments/:id',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'update-commit-comment': {
        'url': '/repos/:user/:repo/comments/:id',
        'method': 'PATCH',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null,
          '$body': null
        }
      },

      'compare-commits': {
        'url': '/repos/:user/:repo/compare/:base...:head',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$base': null,
          '$head': null
        }
      },

      'delete-commit-comment': {
        'url': '/repos/:user/:repo/comments/:id',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'get-readme': {
        'url': '/repos/:user/:repo/readme',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          'ref': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'The String name of the Commit/Branch/Tag. Defaults to master.'
          }
        }
      },

      'get-content': {
        'url': '/repos/:user/:repo/contents/:path',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          'path': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'The content path.'
          },
          'ref': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'The String name of the Commit/Branch/Tag. Defaults to master.'
          }
        }
      },

      'get-archive-link': {
        'url': '/repos/:user/:repo/:archive_format/:ref',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$ref': null,
          'archive_format': {
            'type': 'String',
            'required': true,
            'validation': '^(tarball|zipball)$',
            'invalidmsg': 'Either tarball or zipball',
            'description': 'Either tarball or zipball'
          }
        }
      },

      'get-downloads': {
        'url': '/repos/:user/:repo/downloads',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-download': {
        'url': '/repos/:user/:repo/downloads/:id',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'delete-download': {
        'url': '/repos/:user/:repo/downloads/:id',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'get-forks': {
        'url': '/repos/:user/:repo/forks',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          'sort': {
            'type': 'String',
            'required': false,
            'validation': '^(newest|oldest|watchers)$',
            'invalidmsg': 'Possible values: `newest`, `oldest`, `watchers`, default: `newest`.',
            'description': 'Possible values: `newest`, `oldest`, `watchers`, default: `newest`.'
          },
          '$page': null,
          '$per_page': null
        }
      },

      'fork': {
        'url': '/repos/:user/:repo/forks',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          'org': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional String - Organization login. The repository will be forked into this organization.'
          }
        }
      },

      'get-keys': {
        'url': '/repos/:user/:repo/keys',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-key': {
        'url': '/repos/:user/:repo/keys/:id',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'create-key': {
        'url': '/repos/:user/:repo/keys',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$title': null,
          '$key': null
        }
      },

      'update-key': {
        'url': '/repos/:user/:repo/keys/:id',
        'method': 'PUT',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null,
          '$title': null,
          '$key': null
        }
      },

      'delete-key': {
        'url': '/repos/:user/:repo/keys/:id',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'get-stargazers': {
        'url': '/repos/:user/:repo/stargazers',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-starred': {
        'url': '/user/starred',
        'method': 'GET',
        'params': {
          '$page': null,
          '$per_page': null
        }
      },

      'get-starred-from-user': {
        'url': '/users/:user/starred',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-starring': {
        'url': '/user/starred/:user/:repo',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'star': {
        'url': '/user/starred/:user/:repo',
        'method': 'PUT',
        'params': {
          '$user': null,
          '$repo': null
        }
      },

      'un-star': {
        'url': '/user/starred/:user/:repo',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null
        }
      },

      'get-watchers': {
        'url': '/repos/:user/:repo/watchers',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-watched': {
        'url': '/user/watched',
        'method': 'GET',
        'params': {
          '$page': null,
          '$per_page': null
        }
      },

      'get-watched-from-user': {
        'url': '/users/:user/watched',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-watching': {
        'url': '/user/watched/:user/:repo',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'watch': {
        'url': '/user/watched/:user/:repo',
        'method': 'PUT',
        'params': {
          '$user': null,
          '$repo': null
        }
      },

      'un-watch': {
        'url': '/user/watched/:user/:repo',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null
        }
      },

      'get-hooks': {
        'url': '/repos/:user/:repo/hooks',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-hook': {
        'url': '/repos/:user/:repo/hooks/:id',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'create-hook': {
        'url': '/repos/:user/:repo/hooks',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$name': null,
          'config': {
            'type': 'Json',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Required hash - A Hash containing key/value pairs to provide settings for this hook. These settings vary between the services and are defined in the github-services repo. Booleans are stored internally as `1` for true, and `0` for false. Any JSON true/false values will be converted automatically.'
          },
          'events': {
            'type': 'Array',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional array - Determines what events the hook is triggered for. Default: `[\'push\']`.'
          },
          'active': {
            'type': 'Boolean',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional boolean - Determines whether the hook is actually triggered on pushes.'
          }
        }
      },

      'update-hook': {
        'url': '/repos/:user/:repo/hooks/:id',
        'method': 'PATCH',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null,
          '$name': null,
          'config': {
            'type': 'Json',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Required hash - A Hash containing key/value pairs to provide settings for this hook. Modifying this will replace the entire config object. These settings vary between the services and are defined in the github-services repo. Booleans are stored internally as `1` for true, and `0` for false. Any JSON true/false values will be converted automatically.'
          },
          'events': {
            'type': 'Array',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional array - Determines what events the hook is triggered for. This replaces the entire array of events. Default: `[\'push\']`.'
          },
          'add_events': {
            'type': 'Array',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional array - Determines a list of events to be added to the list of events that the Hook triggers for.'
          },
          'remove_events': {
            'type': 'Array',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional array - Determines a list of events to be removed from the list of events that the Hook triggers for.'
          },
          'active': {
            'type': 'Boolean',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Optional boolean - Determines whether the hook is actually triggered on pushes.'
          }
        }
      },

      'test-hook': {
        'url': '/repos/:user/:repo/hooks/:id/test',
        'method': 'POST',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      },

      'delete-hook': {
        'url': '/repos/:user/:repo/hooks/:id',
        'method': 'DELETE',
        'params': {
          '$user': null,
          '$repo': null,
          '$id': null
        }
      }
    },

    'user': {
      'get-from': {
        'url': '/users/:user',
        'method': 'GET',
        'params': {
          '$user': null
        }
      },

      'get': {
        'url': '/user',
        'method': 'GET',
        'params': {}
      },

      'update': {
        'url': '/user',
        'method': 'PATCH',
        'params': {
          'name': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'email': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'blog': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'company': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'location': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'hireable': {
            'type': 'Boolean',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          },
          'bio': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': ''
          }
        }
      },

      'get-orgs': {
        'url': '/user/orgs',
        'method': 'GET',
        'params': {
          '$page': null,
          '$per_page': null
        }
      },

      'get-emails': {
        'url': '/user/emails',
        'method': 'GET',
        'params': {
          '$page': null,
          '$per_page': null
        }
      },

      'add-emails': {
        'url': '/user/emails',
        'method': 'POST',
        'params': {}
      },

      'delete-emails': {
        'url': '/user/emails',
        'method': 'DELETE',
        'params': {}
      },

      'get-followers': {
        'url': '/users/:user/followers',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-following-from-user': {
        'url': '/users/:user/following',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-following': {
        'url': '/user/following',
        'method': 'GET',
        'params': {
          '$page': null,
          '$per_page': null
        }
      },

      'get-follow-user': {
        'url': '/user/following/:user',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'follow-user': {
        'url': '/user/following/:user',
        'method': 'PUT',
        'params': {
          '$user': null
        }
      },

      'un-follow-user': {
        'url': '/user/following/:user',
        'method': 'DELETE',
        'params': {
          '$user': null
        }
      },

      'get-keys': {
        'url': '/user/keys',
        'method': 'GET',
        'params': {
          '$page': null,
          '$per_page': null
        }
      },

      'get-key': {
        'url': '/user/keys/:id',
        'method': 'GET',
        'params': {
          '$id': null
        }
      },

      'create-key': {
        'url': '/user/keys',
        'method': 'POST',
        'params': {
          '$title': null,
          '$key': null
        }
      },

      'update-key': {
        'url': '/user/keys/:id',
        'method': 'PATCH',
        'params': {
          '$id': null,
          '$title': null,
          '$key': null
        }
      },

      'delete-key': {
        'url': '/user/keys/:id',
        'method': 'DELETE',
        'params': {
          '$id': null
        }
      }
    },

    'events': {
      'get': {
        'url': '/events',
        'method': 'GET',
        'params': {
          '$page': null,
          '$per_page': null
        }
      },

      'get-from-repo': {
        'url': '/repos/:user/:repo/events',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-from-repo-issues': {
        'url': '/repos/:user/:repo/issues/events',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-from-repo-network': {
        'url': '/networks/:user/:repo/events',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-from-org': {
        'url': '/orgs/:org/events',
        'method': 'GET',
        'params': {
          '$org': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-received': {
        'url': '/users/:user/received_events',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-received-public': {
        'url': '/users/:user/received_events/public',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-from-user': {
        'url': '/users/:user/events',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-from-user-public': {
        'url': '/users/:user/events/public',
        'method': 'GET',
        'params': {
          '$user': null,
          '$page': null,
          '$per_page': null
        }
      },

      'get-from-user-org': {
        'url': '/users/:user/events/orgs/:org',
        'method': 'GET',
        'params': {
          '$user': null,
          '$org': null,
          '$page': null,
          '$per_page': null
        }
      }
    },
    'search': {
      'issues': {
        'url': '/legacy/issues/search/:user/:repo/:state/:keyword',
        'method': 'GET',
        'params': {
          '$user': null,
          '$repo': null,
          'state': {
            'type': 'String',
            'required': true,
            'validation': '^(open|closed)$',
            'invalidmsg': 'open, closed, default: open',
            'description': 'open or closed'
          },
          'keyword': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Search term'
          }
        }
      },

      'repos': {
        'url': '/legacy/repos/search/:keyword',
        'method': 'GET',
        'params': {
          'keyword': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Search term'
          },
          'language': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'Filter results by language, see https://github.com/languages'
          },
          'start_page': {
            'type': 'Number',
            'required': false,
            'validation': '^[0-9]+$',
            'invalidmsg': '',
            'description': 'Page number to fetch'
          }
        }
      },

      'users': {
        'url': '/legacy/user/search/:keyword',
        'method': 'GET',
        'params': {
          'keyword': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Keyword search parameters'
          },
          'start_page': {
            'type': 'Number',
            'required': false,
            'validation': '^[0-9]+$',
            'invalidmsg': '',
            'description': 'Page number to fetch'
          }
        }
      },

      'email': {
        'url': '/legacy/user/email/:email',
        'method': 'GET',
        'params': {
          'email': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'Email address'
          }
        }
      }
    },

    'markdown': {
      'render': {
        'url': '/markdown',
        'method': 'POST',
        'params': {
          'text': {
            'type': 'String',
            'required': true,
            'validation': '',
            'invalidmsg': '',
            'description': 'The Markdown text to render'
          },
          'mode': {
            'type': 'String',
            'required': false,
            'validation': '^(markdown|gfm)$',
            'invalidmsg': '',
            'description': 'The rendering mode, `markdown` to render a document as plain Markdown, just like README files are rendered. `gfm` to render a document as user-content, e.g. like user comments or issues are rendered. In GFM mode, hard line breaks are always taken into account, and issue and user mentions are linked accordingly.'
          },
          'context': {
            'type': 'String',
            'required': false,
            'validation': '',
            'invalidmsg': '',
            'description': 'The repository context, only taken into account when rendering as `gfm`'
          }
        }
      }
    }
  };
});