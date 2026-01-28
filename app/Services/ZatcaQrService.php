<?php
namespace App\Services;

class ZatcaQrService
{
    public static function base64TLV(array $tags)
    {
        $result = '';
        foreach ($tags as $tag => $value) {
            $length = strlen($value);
            $result .= chr($tag) . chr($length) . $value;
        }

        return base64_encode($result);
    }

    public static function generate(
        string $sellerName,
        string $vatNumber,
        string $timestamp,
        float $totalAmount,
        float $vatAmount
    ): string {
        return self::base64TLV([
            1 => $sellerName,
            2 => $vatNumber,
            3 => $timestamp,
            4 => number_format($totalAmount, 2, '.', ''),
            5 => number_format($vatAmount, 2, '.', ''),
        ]);
    }
}
