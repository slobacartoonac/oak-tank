const cacheName = 'service_name_v3';

const precachedAssets = [
    "./index.html"
];

self.addEventListener("install", function (event) {
    event.waitUntil(caches.open(cacheName).then((cache) => {
        return cache.addAll(precachedAssets);
    }));
});

self.addEventListener('activate', event => {
    caches.keys().then(function (names) {
        for (let name of names) {
            if (name == cacheName) {
                continue
            }
            caches.delete(name);
        }

    });
});




self.addEventListener("fetch", function (event) {
    let url = new URL(event.request.url)
    if (url.hostname == "firestore.googleapis.com") {
        return
    }
    if (event.request.method != "GET" && event.request.method != "get") {
        return
    }
    let cloneReq = event.request.clone()
    event.respondWith(checkResponse(event.request).catch(function () {
        return returnFromCache(event.request);
    }));
    event.waitUntil(addToCache(cloneReq));
});

var checkResponse = function (request) {
    return new Promise(function (fulfill, reject) {
        fetch(request).then(function (response) {
            if (response.status !== 404) {
                fulfill(response);
            } else {
                reject();
            }
        }, reject);
    });
};

var addToCache = function (request) {
    return caches.open(cacheName).then(function (cache) {
        return fetch(request).then(function (response) {
            console.log(response.url + " was cached");
            return cache.put(request, response);
        });
    });
};

var returnFromCache = function (request) {
    return caches.open(cacheName).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status == 404) {
                return cache.match("index.html");
            } else {
                return matching;
            }
        });
    });
};