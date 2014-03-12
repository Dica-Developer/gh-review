Changelog
=========

n.n.n / 2014-03-12 
------------------

Release: TBA

 * set interactive option to bower install call to avoid breaking CI by a asking bower script
 * remove use collection field inside of filter quick view which is only a reference to app.repocollection use app.repoCollcection instead directly * get a sorted list of repos from the repo collection * don't use the repo collection directly in the view use a DTO object that contains only the required fields
 * initialize FilterModel on direct jump to commit with necessary values instead of a complete commit which has not all necessary values
 * enable deletion of filter in filter overview
 * don't display filter labels in case they are empty * check also for null * use underscore methods for null, undefined and empty check
 * #33 - Add a quick review section to reviews list fixes #33 * add url to show link a commit directly * disable branch selection in quick filter for now it is not necessary for issue #33 to fix * formatting
 * [refactoring] move duplicated code in one method
 * explain what to do to create a filter
 * encode urls in statistics list view too
 * render links in commit view breadcrumb uri encoded (otherwise repo's like feature/bla will lead in silent error)
 * add charts less to style statistics
 * mark commits which is a "no fast forward merge" to highlight a feature merge, fixes #62 * implemented it the way that merge commit is not displayed but the single feature merge commits are with a blue label stating feature
 * encode uri elements like branch, repo and owner * format
 * after deletion of comments remove comment from collection instead only removing it from view * this fix reappearing comments after new comment creation
 * fix #65 - After adding a comment it should be displayed immediately * do this for line and commit comments * on comment model creation use comment message from body_html or from body property (last is taken in cases the comment is returned by the creation command) * return in all cases after comment creation the newly created comment * use commentMessage instead of body_html which is not there in any case
 * add a review state map * add colorAccessor to reviewed pie chart to show every time the right color * show percentage with 2 decimal places precision
 * reset link now reads 'Reset Filter'
 * set defer on initialize to not override member with resolved state
 * remove console.log statement * rename computeStatistics to getData
 * treat css file of dc library as less on import to get it included
 * use d3 scale category for pie chart colors
 * fix test to use comment_id instead of sha * reset comment collection in model to have clear test runs
 * fix not immediate approval because of using wrong property, the commit id in a comment is stored under the key commit_id instead of sha in the object returned after comment creation * comment this special case
 * split pie chart in approved / not approved / not reviewed
 * surround bar chart with bootstrap column
 * fetching data from the last 4 weeks instead of 2 weeks * remove try catch * remove unnecessary jshint comment * remove bar chart * set time range for commits per day chart to 4 weeks
 * Squashed commit of the following:
 * remove comment
 * fix #57 - Add comment button for whole commit not only for lines. * adding after every commit a open comment box
 * formatting
 * extend repo-view test with init test and collection add test
 * add commit-list-view tests for initialize
 * stabilize tests
 * stabilize test
 * fix test
 * extend test
 * fix test by setting the created approval comment as parameter to the resolve call for commit approval * add commented lines that check for setting a commit immediately to approved (did not work because app is not the right app)
 * run with nodes 0.10 instead of 0.8
 * use sha for getting a commit id from a comment * we need to send comment_id and sha for adding a comment, why?
 * fixes #61 - @@ in a commit false detects a commit as a chunk header * add tests for it
 * #44, set schema version to approval comment * refactor approval comment to a comment holding the state of a commit * store state as json * store approver, approval date, schema version and whether it is approved * refactor out method for setting a commit as approved * remove duplicate check for commit approval from comment collector worker * format
 * fix tests by adding commit message to model
 * remove duplicate parameter
 * update change log
 * render commit comments
 * remove border from commit comments
 * add commit comment template
 * change name of comment view template to commit view
 * add more div container with appropriate class definitions to follow bootstrap api
 * update change log
 * add line breaks to commit message in comment view
 * no need to check splits length
 * html escape commit messages in commit model instead in template * no need to check if message is array because it array everytime
 * add bottom margin to commit list prev/next buttons * change template path in commit list view * add more div container with appropriate class definitions to follow bootstrap api
 * use container-fluid class for main container to use full available width
 * rename review-detail template to commit-list
 * style commit list view * add separate less file for commit list view * add text-overflow: ellipse to commit message to avoid long commit message will break the boundaries
 * use prepareView instead of two other methods
 * add comment after approval to comment collection to have immediately response of approval
 * fix comparison, it is true in case the commitApproved map returns true for the commit id * fix wrong key for commit id, it is sha instead of commit_id
 * Update changelog.md
 * hide ajax indicator after rendering about view
 * fix tests by adding new files to test-main

Version 0.2.0
-------------

Release: 27 Feb 2014

* inform user about updates
* #60 Show change log in about view
* #59 Add "about" entry and view to show the user who we are

Version 0.1.0
-------------

Release: 27 Feb 2014

* add welcome screen and show first steps to add a filter

