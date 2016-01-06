jQuery(document).ready(function($) {
 
    // animated scroll function
	$(".scroll").click(function(e){	
		e.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top-78}, 1500,'easeInOutQuad');
	});

    if (location.hash) {
        $('html,body').animate({scrollTop:$(location.hash).offset().top-78}, 0,'easeInOutQuad');
    }
    

    // Toggles the mobile menu
	$('.mobileToggle').click(function(e) {
	   e.preventDefault();
	   $('nav').fadeToggle('slow');
	});

    $('.video-screenshot').click(function(e) {
        e.preventDefault();
        $(this).fadeOut('is-opened');
        player.playVideo();
    });



    // Toggles the checkout
    $('.open-checkout').click(function(e) {
        e.preventDefault();
        $('.checkout-form').addClass('is-opened');
        $('body').addClass('no-scroll');
        $('.site-container').addClass('fade-out');
    });


    $('#contact-info .prev-screen').click(function(e) {
        e.preventDefault();
        $('.checkout-form').removeClass('is-opened');
        $('body').removeClass('no-scroll');
        $('.site-container').removeClass('fade-out');
    });

    $('#contact-info .next-screen').click(function(e) {
        e.preventDefault();

        if(allRequiredFieldsFilled("#contact-info")) {
            $('#contact-info').addClass('is-deactivated');
            $('#billing').addClass('is-active');
        }
    });

    $('#billing .prev-screen').click(function(e) {
        e.preventDefault();
        $('#contact-info').removeClass('is-deactivated');
        $('#billing').removeClass('is-active');
    });

    $('#billing .next-screen').click(function(e) {
        e.preventDefault();
        if(allRequiredFieldsFilled("#billing")) {
            $('#billing').addClass('is-deactivated');
            $('#shipping').addClass('is-active');
        }
    });

    $('#shipping .prev-screen').click(function(e) {
        e.preventDefault();
        $('#shipping').removeClass('is-active');
        $('#billing').removeClass('is-deactivated');
    });

    $('#shipping .next-screen').click(function(e) {
        e.preventDefault();
        if(allRequiredFieldsFilled("#shipping")) {
            $('#shipping').addClass('is-deactivated');
            $('#card-info').addClass('is-active');
        }
    });

    $('#card-info .prev-screen').click(function(e) {
        e.preventDefault();
        $('#card-info').removeClass('is-active');
        $('#shipping').removeClass('is-deactivated');
    });

    $('#card-info .next-screen').click(function(e) {
        e.preventDefault();
        $('#card-info').addClass('is-deactivated');
        $('#transaction-complete').addClass('is-active');
        $('.transaction-success-icon').addClass('is-success');
    });

    $('#transaction-complete .close-checkout').click(function(e) {
        e.preventDefault();
        $('.checkout-form').addClass('is-closed');
        $('body').removeClass('no-scroll');
        $('.site-container').removeClass('fade-out');

        $(".is-deactivated").removeClass("is-deactivated");
        $(".is-active").removeClass("is-active");
        $(".is-opened").removeClass("is-opened");
        $(".is-closed").removeClass("is-closed");

        $(".purchase-screen:first-child").addClass("is-active");

        resetFormFields();
    });



    $('.duplicate-shipping').click(function(e) {
        e.preventDefault();
        $(this).toggleClass('is-duplicated');
    });

    if ($(window).width() < 801 ){
	   $('.home nav ul li a').click(function(e) {
		  e.preventDefault();
	 	 $('nav').fadeToggle('slow');
	   });
    }

    $('.testimonial-slider').bxSlider({
      mode: 'horizontal',
      adaptiveHeight: true,
      pager: false,
      controls: false,
      auto: true,
      speed: 500,
      pause: 6000,
    });

    var feed = new Instafeed({
        get: 'user',
        userId: 2217134689,
        accessToken: '2217134689.467ede5.91d74aedfc674986a3aa1c76075a3705',
        template: '<a href="{{link}}"><img src="{{image}}" /></a>'
    });
    feed.run();

    var config1 = {
      "id": '654334221352210432',
      "domId": 'twitterfeed',
      "maxTweets": 2,
      "enableLinks": true,
      "showUser": false,
      "showTime": true,

    };
    twitterFetcher.fetch(config1);

    $(window).scroll(function() {

        if ($(this).scrollTop() > 10) {
           $('#header-wrapper').addClass('shrink');
        } else {
           $('#header-wrapper').removeClass('shrink');
        }
    });

    // ================ PAYMENT FORM ==================

    var resetFormFields = function(){
        $("#payment-form input").val("");

        $("#billing_country").val("CANADA");
        $(".us_billing_province_state").hide().attr("disabled","disabled");
        $(".canada_billing_province_state").show().removeAttr("disabled").val("AB");


        $("#shipping_country").val("CANADA");
        $(".us_shipping_province_state").hide().attr("disabled","disabled");
        $(".canada_shipping_province_state").show().removeAttr("disabled").val("AB");


        $(".pay-now").removeClass("loading").removeAttr("disabled");
    };

    allRequiredFieldsFilled = function(section){
        var check = true;
        $(".error",section).removeClass("error");
        $(".required",section).each(function(index,value){
            if(String($(this).val()).trim() === ""){
                $(this).addClass("error");
                check = false;
            }
        });

        return check;
    };

    isDuplicated = function(){
        return $(".duplicate-shipping").hasClass("is-duplicated");
    };

    var quantity = $("#quantity").val(),
        cartPrice = 24.99*100,
        shippingTax = 15.00*100,
        tax = 0.13,
        cartTotal = 0;

    $("#quantity").on("change",function(){
        quantity = $("#quantity").val();
        cartPrice = 24.99*100;
        $("#total_quantity").val(quantity);
        calculatePrice();
    });

    canadaShippingTaxes = {
        "AB" : "0.05",
        "BC" : "0.12",
        "MB" : "0.13",
        "NB" : "0.13",
        "NL" : "0.13",
        "NT" : "0.05",
        "NS" : "0.15",
        "NU" : "0.05",
        "ON" : "0.13",
        "PE" : "0,14",
        "QC" : "0.14975",
        "SK" : "0.10",
        "YT" : "0.05"
    }

    $("#shipping_country").on("change",function(){
        if($(this).val()==="US"){
            tax = 0;
            shippingTax = 3100;
        }
        else {
            tax = canadaShippingTaxes[$(".canada_shipping_province_state").val()];
            shippingTax = $(".canada_shipping_province_state").val() === "ON" ? 1500 : 2200;
        }

        calculatePrice();
    });

    $("#payment-form").on("change",".canada_shipping_province_state", function(){
        tax = canadaShippingTaxes[$(this).val()];
        calculatePrice();
    });

    calculatePrice = function(){
        quantity = $("#quantity").val();
        cartPrice = 2499 * quantity;

        if ($("#shipping_country").val() === "US") {
            tax = 0;
            shippingTax = 3100;
        }
        else {
            tax = canadaShippingTaxes[$(".canada_shipping_province_state").val()];
            shippingTax = ($(".canada_shipping_province_state").val() === "ON") ? 1500 : 2200;

        }

        $(".cart-quantity").html(quantity);
        $(".cart-price").html("$"+(cartPrice/100).toFixed(2));
        $(".cart-shipping-tax").html("$"+(shippingTax/100));
        $(".cart-tax").html((tax*100)+"%");


        cartTotal = Math.round(((cartPrice*1) + (shippingTax*1)) * (1+(tax*1)));
        taxTotal = Math.round(((cartPrice*1) + (shippingTax*1)) * (tax*1));
        $(".cart-total-amount").html("$"+(cartTotal/100).toFixed(2));

        //set price in hidden field
        $("#total_amount").val(cartTotal);
        $("#total_shipping").val(shippingTax/100);
        $("#total_tax").val(taxTotal/100);

    },

    calculatePrice();

    $("#billing_country").on("change",function(){
        if($("#billing_country").val() === "US"){
            $(".canada_billing_province_state").hide().attr("disabled","disabled");
            $(".us_billing_province_state").show().removeAttr("disabled");

            if(isDuplicated()){
                $("#shipping_country").val("US");
                $(".canada_shipping_province_state").hide().attr("disabled","disabled");
                $(".us_shipping_province_state").show().removeAttr("disabled");
            }
        }
        else {
            $(".us_billing_province_state").hide().attr("disabled","disabled");
            $(".canada_billing_province_state").show().removeAttr("disabled");

            if(isDuplicated()){
                $("#shipping_country").val("CANADA");
                $(".us_shipping_province_state").hide().attr("disabled","disabled");
                $(".canada_shipping_province_state").show().removeAttr("disabled");
            }
        }
        calculatePrice();
    });

    $("#billing").on("change", ".billing_province_state" ,function(){
        $(".shipping_province_state").val($(this).val());
        calculatePrice();
    });



    $("#shipping_country").on("change",function(){
        if($("#shipping_country").val() === "US"){
            $(".canada_shipping_province_state").hide().attr("disabled","disabled");
            $(".us_shipping_province_state").show().removeAttr("disabled");
        }
        else {
            $(".us_shipping_province_state").hide().attr("disabled","disabled");
            $(".canada_shipping_province_state").show().removeAttr("disabled");
        }
        calculatePrice();
    });




    //autofill shipping data
    $(".card-holder-name").on("change",function(){
        if(isDuplicated()) {
            $(".shipping_full_name").val($(this).val());
        }
    });
    $(".card-holder-address").on("change",function(){
        if(isDuplicated()) {
            $(".shipping_street_address").val($(this).val());
        }
    });
    $(".card-holder-address2").on("change",function(){
        if(isDuplicated()) {
            $(".shipping_street_address2").val($(this).val());
        }
    });
    $(".card-holder-city").on("change",function(){
        if(isDuplicated()) {
            $(".shipping_city").val($(this).val());
        }
    });
    $(".card-holder-zip").on("change",function(){
        if(isDuplicated()) {
            $(".shipping_zip_code").val($(this).val());
        }
    });

    copyBillingData = function(){
        $(".shipping_full_name").val($(".card-holder-name").val());
        $(".shipping_street_address").val($(".card-holder-address").val());
        $(".shipping_street_address2").val($(".card-holder-address2").val());
        $(".shipping_city").val($(".card-holder-city").val());
        $(".shipping_zip_code").val($(".card-holder-zip").val());

        if($("#billing_country").val() === "US") {
            $("#shipping_country").val("US");
            $(".canada_shipping_province_state").hide().attr("disabled","disabled");
            $(".us_shipping_province_state").show().removeAttr("disabled").val($(".us_billing_province_state").val());
        }
        else {
            $("#shipping_country").val("CANADA");
            $(".us_shipping_province_state").hide().attr("disabled","disabled");
            $(".canada_shipping_province_state").show().removeAttr("disabled").val($(".canada_billing_province_state").val());
        }
    };


    $(".duplicate-shipping").click(function(){
       if(isDuplicated()){
           copyBillingData();
       }
        else {
           $("#shipping input").val("");
           $("#shipping_country").val("CANADA");
           $(".us_shipping_province_state").hide().attr("disabled","disabled");
           $(".canada_shipping_province_state").show().removeAttr("disabled").val("AB");
       }
    });


    $("#shipping input").on("keydown", function(){
        $(".duplicate-shipping").removeClass("is-duplicated");
    });
    $("#shipping select").on("change", function(){
        $(".duplicate-shipping").removeClass("is-duplicated");
    });


    $('#payment-form').submit(function(event) {
        var $form = $(this);

        $form.find('button').prop('disabled', true).addClass("loading");

        Stripe.card.createToken({
            number: $('.card-number').val(),
            cvc: $('.card-cvc').val(),
            exp_month: $('.card-expiry-month').val(),
            exp_year: $('.card-expiry-year').val(),

            name: $('.card-holder-name').val(),
            email: $('.card-holder-email').val(),
            phone: $('.card-holder-phone').val(),

            address_line1: $('.card-holder-address').val(),
            address_line2: $('.card-holder-address2').val(),
            address_city: $('.card-holder-city').val(),
            address_zip: $('.card-holder-zip').val(),
            address_state: $('.card-holder-state').val(),
            address_country: $('.card-holder-country').val()
        }, stripeResponseHandler);

        return false;
    });

    stripeResponseHandler = function (status, response) {
        var $form = $('#payment-form');

        if (response.error) {
            $(".payment-error").html(response.error.message).show();
            $form.find('button').removeAttr('disabled').removeClass("loading");
        } else {
            //response contains id and card, which contains additional card details
            var token = response.id;
            // Insert the token into the form so it gets submitted to the server
            $form.append($('<input type="hidden" name="stripeToken" />').val(token));

            // and submit
            //$form.get(0).submit();

            $.ajax({
                type: "POST",
                url: "stripe.php",
                data: $("#payment-form").serialize(),
                success: function(msg) {
                    if(msg==="success"){
                        $('#card-info').addClass('is-deactivated');
                        $('#transaction-complete').addClass('is-active');
                        $('.transaction-success-icon').addClass('is-success');

                        $("#quantity").val("1");
                        sendEmail();

                    }
                    else {
                        $(".payment-error").html(msg).show();
                        $form.find('button').removeAttr('disabled').removeClass("loading");
                    }
                }
            });
        }
    };

    sendEmail = function(){
        $.ajax({
            type: "POST",
            url: "sendemail.php",
            data: $("#payment-form").serialize(),
            success: function() {
                //console.log("Confirmation email sent");
            },
            error: function(){
                //console.log("Email sending error");
            }
        });
    };


});

$(window).load(function() {

	// Spy Scroller
	var sections,
        numberOfSections = $(".spy").length,
        activeSection;

    function initSpyScroller(){
        sections = [];
        //get positions of all sections
        $(".spy").each(function (index, val){
            var section = {};
            section.start = $($(this).attr('href')).offset().top;
            section.menuReference = $(this);
            section.active = false;

            if (index > 0 && index !== numberOfSections - 1) {
                sections[index - 1].end = $($(this).attr('href')).offset().top;
            }
            if (index === numberOfSections - 1) {
                sections[index - 1].end = $($(this).attr('href')).offset().top;
                section.end = $(document).height();
            }

            sections.push(section);
        });

        //set active section
        for (var i = 0; i < sections.length; i++) {
            var currentPosition = $(window).scrollTop();
            if (sections[i].start < currentPosition && sections[i].end > currentPosition) {
                sections[i].active = true;
                activeSection = i;
            }
        }
        activeSection = activeSection || -1;

        console.log("Spy Scroller Initialized");
    }

    initSpyScroller();
    $(window).resize(function(){
        initSpyScroller();
    });

    var locationDetect,
        insideSection;




	$(window).scroll(function() {

        locationDetect = $(this).scrollTop();
        insideSection = false;
        for(var i=0; i<sections.length; i++){
            if(sections[i].start - $(".header-wrapper").outerHeight() - 10 < locationDetect && sections[i].end - $(".header-wrapper").outerHeight() - 10 > locationDetect){
                if(!sections[i].active){
                    sections[i].active = true;
                    $(".spy.active").removeClass("active");
                    sections[i].menuReference.addClass('active');

                    if (activeSection !== -1) {
                        sections[activeSection].active = false;
                    }
                    activeSection = i;
                    console.log("CHANGE");
                }
                insideSection = true;
            }
        }

        if(!insideSection && $(".spy.active").length){
            $(".spy.active").removeClass("active");
            console.log("CLEAR");
        }


    });

});


