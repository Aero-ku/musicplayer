var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body)
var index = 0;
var songList;
var audio = new root.audioControl();


function bindEvent(){
    $scope.on("play:change", function(event, index){
        audio.getAudio(songList[index].audio);
        if(audio.status == "play"){
            audio.play();
        }
        root.process.renderAllTime(songList[index].duration)
        root.process.updata(0);
    })
    $scope.on("click",".prev-btn", function(){
        var index = controlManager.prev();
        root.render(songList[index]);
        $scope.trigger("play:change", index);
    })
    $scope.on("click", ".play-btn", function(){
        if(audio.status == "play"){
            audio.pause();
            root.process.stop();
        } else {
            audio.play();
            root.process.start();
        }
        $(this).toggleClass("pause"); 
    })
    $scope.on("click",".next-btn", function(){
        var index = controlManager.next();
        root.render(songList[index]);
        $scope.trigger("play:change", index);
    })
}

function bindTouch(){
    var $slider = $scope.find('.slider-pointer');
    var offset = $scope.find('.pro-wrapper').offset();
    var left = offset.left;
    var width = offset.width;
    $slider.on('touchstart', function(){
        root.process.stop();
    }).on('touchmove', function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per <0 || per > 1){
            per = 0;
        }
        root.process.updata(per);
    }).on('touchend', function(){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per <0 || per > 1){
            per = 0;
        }
        var curDuration = songList[controlManager.index].duration;
        var curTime = per * curDuration;
        audio.playTo(curTime);
    })
}

function getData(url){
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data){
            root.render(data[0]);
            songList = data;
            bindEvent();
            controlManager = new root.controlManager(data.length);
            $scope.trigger("play:change",0);
            bindTouch();
        },
        error: function(){
            console.log('error')
        }
    })
}

getData('../mock/data.json');