/* ================================ */

// $(document).ready(function () {

//     var navListItems = $('div.setup-panel div a'),
//             allWells = $('.setup-content'),
//             allNextBtn = $('.nextBtn');
  
//     allWells.hide();
  
//     navListItems.click(function (e) {
//         e.preventDefault();
//         var $target = $($(this).attr('href')),
//                 $item = $(this);
  
//         if (!$item.hasClass('disabled')) {
//             navListItems.removeClass('btn-primary').addClass('btn-default');
//             $item.addClass('btn-primary');
//             allWells.hide();
//             $target.show();
//             $target.find('input:eq(0)').focus();
//         }
//     });
  
//     allNextBtn.click(function(){
//         var curStep = $(this).closest(".setup-content"),
//             curStepBtn = curStep.attr("id"),
//             nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
//             curInputs = curStep.find("input[type='text'],input[type='url']"),
//             isValid = true;
  
//         $(".form-group").removeClass("has-error");
//         for(var i=0; i<curInputs.length; i++){
//             if (!curInputs[i].validity.valid){
//                 isValid = false;
//                 $(curInputs[i]).closest(".form-group").addClass("has-error");
//             }
//         }
  
//         if (isValid)
//             nextStepWizard.removeAttr('disabled').trigger('click');
//     });
  
//     $('div.setup-panel div a.btn-primary').trigger('click');
//   });

/* ================================ */


  $(document).ready(function(){

    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;
    
    setProgressBar(current);
    
    $(".next").click(function(){
    
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    
    //Add Class Active
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    
    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
    step: function(now) {
    // for making fielset appear animation
    opacity = 1 - now;
    
    current_fs.css({
    'display': 'none',
    'position': 'relative'
    });
    next_fs.css({'opacity': opacity});
    },
    duration: 500
    });
    setProgressBar(++current);
    });
    
    $(".previous").click(function(){
    
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();
    
    //Remove class active
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    
    //show the previous fieldset
    previous_fs.show();
    
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
    step: function(now) {
    // for making fielset appear animation
    opacity = 1 - now;
    
    current_fs.css({
    'display': 'none',
    'position': 'relative'
    });
    previous_fs.css({'opacity': opacity});
    },
    duration: 500
    });
    setProgressBar(--current);
    });
    
    function setProgressBar(curStep){
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar")
    .css("width",percent+"%")
    }
    
    $(".submit").click(function(){
    return false;
    })
    
    });
/* ================================ */
