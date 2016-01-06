<?php
require_once __DIR__ . '/vendor/autoload.php';
\Stripe\Stripe::setApiKey("sk_test_wdxIaJ1THgVyiRvoCubf8kHf");

$token = $_POST['stripeToken'];

$shipping_full_name = $_POST['shipping_full_name'];
$shipping_street_address = $_POST['shipping_street_address'];
$shipping_street_address2 = $_POST['shipping_street_address2'];
$shipping_city = $_POST['shipping_city'];
$shipping_zip_code = $_POST['shipping_zip_code'];
$shipping_country = $_POST['shipping_country'];
$shipping_province_state = $_POST['shipping_province_state'];

$email = $_POST['email_address'];
$total_quantity = $_POST['total_quantity'];
$total_amount = $_POST['total_amount'];
$total_tax = $_POST['total_tax'];
$total_shipping = $_POST['total_shipping'];

try {
    $charge = \Stripe\Charge::create(array(
            "amount" => $total_amount, // amount in cents
            "currency" => "cad",
            "source" => $token,
            "description" => "Spark Free Cable x ".$total_quantity,
            "receipt_email" => $email,

            "metadata" => array(
                "quantity" => $total_quantity,
                "tax" => $total_tax,
                "shipping_cost" => $total_shipping,
            ),

            "shipping" => array(
                "address" => array(
                    "city" => $shipping_city,
                    "country" => $shipping_country,
                    "line1" => $shipping_street_address,
                    "line2" => $shipping_street_address2,
                    "postal_code" => $shipping_zip_code,
                    "state" => $shipping_province_state,
                ),
                "name" => $shipping_full_name
            ),

        )
    );

//    echo $charge;
    echo "success";

} catch(\Stripe\Error\Card $e) {
    echo $e->getMessage();
}

