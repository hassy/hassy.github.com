$(function(){

    locache.flush();

    test("model creation and updating", function() {

        expect(4);

        // The following model instance is created with an ID taken from an
        // API call.
        r = new GAPP.models.Resource({"id": "4da0439689cb164d15000003"});

        // Check that change is called. Remove the change event, and assign
        // a new one that stops this test. Finally calls another fetch to
        // test it comes from the cache.
        r.on("change", function(){

            equal(r.get('title'), "You First Advocacy.");
            r.off("change");
            r.on("change", function(){
                start();
            });
            r.fetch();

        });

        // We don't have the title yet.
        equal(r.get('title'), undefined);
        equal(r.url(), 'http://www.aliss.org/api/resources/4da0439689cb164d15000003/');

        // Trigger a refresh of the model
        r.fetch();
        // We still wont have the title as its aync.
        notEqual(r.get('title'), "You First Advocacy.");

        stop();

    });

    test("fetching a collection", function(){

        expect(1);


        var rs = new GAPP.collections.ResourceCollection();
        rs.fetch({
            'success': function(){
                strictEqual(rs.length, 10);
                start();
            }
        });

        stop();

    });

    test("fetching a filtered collection", function(){

        expect(1);


        var rs = new GAPP.collections.ResourceCollection();
        rs.fetch({
            'success': function(){
                strictEqual(rs.length, 5);
                start();
            },
            'data': {
                max: 5,
                query: "health",
                location: "glasgow"
            }
        });

        stop();

    });

    test("fetching a cached result", function(){

        expect(1);

        var rs = new GAPP.collections.ResourceCollection();
        rs.fetch({
            'success': function(){
                strictEqual(rs.length, 5);
            },
            'data': {
                max: 5,
                query: "health",
                location: "glasgow"
            }
        });

    });

});