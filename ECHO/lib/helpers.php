<?php
function base64_to_blob(?string $b64): ?string {
  if (!$b64) return null;
  if (strpos($b64, ',') !== false) $b64 = explode(',', $b64, 2)[1];
  return base64_decode($b64);
}
