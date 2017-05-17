      $(document).ready(function(){
        window.metrics = {"analytics": {"scroll_depth": 0}, "ads": []}
        window.startTime = new Date().getTime()
        adload()
        window.onunload = function() {
          submitMetrics()
        }
        $(window).on("scroll", function(){
          amountScrolled()
          adload()
        })
    })

    function submitMetrics(){
        metrics.analytics.total_time = new Date().getTime() - startTime
        $.ajax({
          type: "POST",
          url: "https://voxadserver.herokuapp.com/metrics",
          dataType: "json",
          data: JSON.stringify(metrics),
          contentType: "application/json"
        })
    }

    // function submitMetricsTest(){
    //     metrics.analytics.total_time = new Date().getTime() - startTime
    //       $.ajax({
    //         type: "POST",
    //         url: "https://voxadserver.herokuapp.com/metrics",
    //         dataType: "json",
    //         data: JSON.stringify(metrics),
    //         contentType: "application/json"
    //         })
    //         .done(function (response){
    //           console.log(response)
    //           })
    //         .fail(function(response){
    //         console.log(response)
    //           })
    // }

    function amountScrolled(){
        var winHeight = $(window).height()
        var docheight = $(document).height()
        var scrollTop = $(window).scrollTop()
        var trackLength = docheight - winHeight
        var scrollPercent = (Math.round(scrollTop/trackLength * 100)/100)
          if(metrics.analytics.scroll_depth < scrollPercent){
              metrics.analytics.scroll_depth = scrollPercent
              }
    }


    function adload(){

    var windowTop = $(window).scrollTop()
    var windowBottom = windowTop + $(window).height()

      $(".ad-container").each(function(){
        var containerTop = $(this).offset().top
        var containerBottom = containerTop + $(this).height()

        if(!$(this).attr("loaded") && windowTop<=containerBottom && windowBottom >= containerTop){
            $(this).attr("loaded",true)
            metrics.ads.push({"id": this.id, "time": new Date().getTime()-startTime})

            var that = this
            return $.ajax({
              method: "GET",
              url: "https://voxadserver.herokuapp.com/ads/"+this.id
              })
              .done(function (response){
                that.innerHTML = response
                })
              .fail(function(){
                that.remove()
                })
          }
      })
    }