// 渲染进度条
(function($, root){
    var $scope = $(document.body);
    var curDuration;
    var frameId;
    var lastPercentage = 0;
    var startTime;
    // 秒转分钟
    function formatTime(time){
        time = Math.floor(time);
        var minute = Math.floor(time / 60);
        var second = time - minute * 60;
        if(minute < 10){
            minute = "0" + minute;
            console.log(minute);
        }
        if(second < 10){
            second = "0" + second;
        }
        
        return minute + ":" + second;
    }
    // 渲染当前总时间
    function renderAllTime(duration){
        curDuration = duration;
        var allTime = formatTime(duration)
        $scope.find('.all-time').html(allTime);
    }

    function updata(percent){
        var curTime = percent * curDuration;
        console.log(curTime)
        curTime = formatTime(curTime);
        console.log(curTime);
        $scope.find(".cur-time").html(curTime);
        // 渲染进度条
        var percentage = (percent - 1) * 100 + "%";
        $scope.find(".pro-top").css({
            'transform': 'translateX(' + percentage + ')'
        })
    }

    //开始播放，让进度条和显示的时间改变
    function start(){
        lastPercentage = 0;
        startTime = new Date().getTime();
        function frame(){
            var curTime = new Date().getTime();
            var percent = lastPercentage + (curTime - startTime) / (curDuration * 1000)
            frameId = requestAnimationFrame(frame); 
            updata(percent);
        }
        frame();
    }

    function stop(){
        var stopTime = new Date().getTime();
        lastPercentage = lastPercentage + (stopTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(frameId);
    }
    root.process = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        updata: updata
    }
})(window.Zepto,window.player || (window.player = {}))