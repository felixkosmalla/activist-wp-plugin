(function(){

  var waittime = 1000;

  function progress(xhr, callback){
    console.log('progress');
  } 

  function done(xhr, callback){
    console.log('load');
    callback(0, xhr);
  }

  function error(xhr, callback){
    console.error('error', xhr);
    callback(1, xhr);
  }

  function timeout(xhr, callback){

    console.error('timeout');
    callback(1, xhr);
  }





  function dispatch(url, callback) {
    var xhr = new XMLHttpRequest();
    
    xhr.addEventListener("progress", progress.bind({}, xhr, callback), false);
    xhr.addEventListener("load", done.bind({}, xhr, callback), false);
    xhr.addEventListener("error", error.bind({}, xhr, callback), false);
    xhr.timeout = waittime;
    xhr.ontimeout = timeout.bind({}, xhr, callback);
    console.log('getting URL',url);
    xhr.open("GET", url);
    // xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.send();
  }

  function getScriptUrl(){
    // find the activist script
    var s = document.getElementsByTagName('script');

    for (i in s){
        scr = s[i];
        console.log('searching for the activist script');
        if(scr.src.indexOf('aactivist.js')!==-1){
            console.log(scr);
            return scr.src;
        }
        
    }
    
    return false;

  }
  

  function checkConnectivity(callback){
    // see if we can reach an uncached version of the activist script and see if it is actually the script
    var url = getScriptUrl();


    // add random string
    var r = Math.floor((Math.random() * 100000000) + 1);
    var url_uncached = url + "?rand="+String(r);

    
    console.log(url_uncached);
    dispatch(url_uncached, function(error_uncached, xhr_uncached){
      if(error_uncached == 0){

        // dispatch a second version with the cached script because we cannot read the JS's content straigt from the DOM
        dispatch(url, function(error, xhr){
          // compare the two strings
          //console.log("uncached" ,xhr_uncached.response);
          //console.log("cached" ,xhr.response);

          var same = xhr_uncached.response == xhr.response;
          console.log('scripts are equal: ',same);
          callback(same);

        });

      }else{
        callback(false);
      }
    });
  }

  console.log('checking connectivity');
  checkConnectivity(function(result){

    console.log('result', result);

    if(!result){
      alert('Activist.js script not found or altered. This could mean that this site was censored and will be gone upon the next reload.')
    }else{
      // switch the appcache immediately
      var appCache = window.applicationCache;

      if (appCache.status == appCache.UPDATEREADY) {
        appCache.swapCache();  // The fetch was successful, swap in the new cache.
        window.location.reload();
      }
    }


      console.log('Site is reachable: ', result);
  });




})();