        it('should successfully execute <%= name %>', function (done) {
            var callback = function (err, res) {
                expect(err).toBeNull();
                done();
            };

            github.<%= funcName %>(
                <%= params %>,
                callback
            );
        });
