/*global define, describe, it, expect, beforeEach, xit*/
(function () {
    xdescribe('[util]', function () {

        it('Should be defined', function () {
            expect(util).toBeDefined();
        });

        it('util#extend should shallow copy one object to another and not override existing members', function () {
            var srcObj = {'number': 1, 'string': 'test', 'boolean': true, 'function': function () {
            }, 'array': [1, 2, 3]};
            var destObj = {'number': 2};

            var newObj = util.extend(destObj, srcObj);
            expect(newObj).not.toEqual(srcObj);

            destObj.number = 1;
            var newObjOveride = util.extend(destObj, srcObj);
            expect(newObjOveride).toEqual(srcObj);
        });

        it('util#extend should shallow copy one object to another and should override existing members', function () {
            var srcObj = {'number': 1, 'string': 'test', 'boolean': true, 'function': function () {
            }, 'array': [1, 2, 3]};
            var destObj = {'number': 2};

            var newObj = util.extend(destObj, srcObj, true);
            expect(newObj).toEqual(srcObj);
        });

        it('util#escapeRegExp should escape regex sensible characters', function () {
            var forbiddenCharacter = '.*+?^${}()|';
            var escapedString = util.escapeRegExp(forbiddenCharacter);
            expect(escapedString).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|');
        });

        it('util#toCamelCase should return correct string', function () {
            var camelCaseString = util.toCamelCase('why U no-work');
            var camelCaseStringWithCapital = util.toCamelCase('why U no-work', true);
            expect(camelCaseString).toBe('whyUNoWork');
            expect(camelCaseStringWithCapital).toBe('WhyUNoWork');
        });

        it('util#isTrue should return true', function () {
            expect(util.isTrue(true)).toBeTruthy();
            expect(util.isTrue('true')).toBeTruthy();
            expect(util.isTrue('on')).toBeTruthy();
            expect(util.isTrue(1)).toBeTruthy();
            expect(util.isTrue('1')).toBeTruthy();
        });

        it('util#isFalse should return true', function () {
            expect(util.isFalse(false)).toBeTruthy();
            expect(util.isFalse('false')).toBeTruthy();
            expect(util.isFalse('off')).toBeTruthy();
            expect(util.isFalse(0)).toBeTruthy();
            expect(util.isFalse('0')).toBeTruthy();
        });
    });
}());
