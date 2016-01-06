<?php
extract($_REQUEST, EXTR_OVERWRITE);

$stamp = date("Ymdhis");
$random_id_length = 6;
$rndid = generateRandomString( $random_id_length );

$orderid = $stamp ."-". $rndid;

function generateRandomString($length = 10) {
  $characters = '0123456789';
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
    $randomString .= $characters[rand(0, strlen($characters) - 1)];
  }
  return $randomString;
}

$buyer_email = $email_address;
$seller_email = "tim@mcmillanfreelance.ca";
$subject = "Purchase confirmation";

$headers = "From: tim@mcmillanfreelance.ca\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

$message = file_get_contents("receipt.html");

//formating
$shipping_country = $shipping_country == "US" ? "US" : "Canada";

$message = str_replace("{{shipping_street_address}}",$shipping_street_address,$message);
$message = str_replace("{{shipping_street_address2}}",$shipping_street_address2,$message);
$message = str_replace("{{shipping_city}}",$shipping_city,$message);
$message = str_replace("{{shipping_province_state}}",$shipping_province_state,$message);
$message = str_replace("{{shipping_country}}",$shipping_country,$message);
$message = str_replace("{{shipping_zip_code}}",$shipping_zip_code,$message);
$message = str_replace("{{total}}",$total_amount/100,$message);
$message = str_replace("{{date}}",date("F d, Y"),$message);
$message = str_replace("{{receipt_number}}",$orderid,$message);
$message = str_replace("{{quantity}}",$total_quantity,$message);
$message = str_replace("{{price}}",24.99*$total_quantity,$message);
$message = str_replace("{{shipping_price}}",$total_shipping,$message);
$message = str_replace("{{tax}}",$total_tax,$message);


mail($buyer_email, $subject, $message, $headers);
mail($seller_email, $subject, $message, $headers);
