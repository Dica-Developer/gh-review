/*global define, describe, it, expect, spyOn, xit*/
define(['CommentCollection', 'commentBox'], function(CommentCollection, commentBox){
  'use strict';

  describe('#CommentCollection', function(){

    it('Should be defined', function(){
      expect(CommentCollection).toBeDefined();
    });

    xit('.addComments should initiate new commentBox twice', function(){
      var commentBoxSpy = spyOn(commentBox.show.prototype, 'initialize');
      var collection = new CommentCollection([
        {
          name: 'test1'
        },
        {
          name: 'test2'
        }
      ]);

      collection.addComments();
      expect(commentBoxSpy).toHaveBeenCalled();
      expect(commentBoxSpy.calls.length).toBe(2);
    });

  });

});
