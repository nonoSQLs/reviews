`SELECT reviews.review_id,
 reviews.destination_id,
 reviews.user_id,
 reviews.review_date_created,
 reviews.date_experience_start,
 reviews.date_exeperience_end,
 reviews.review_helpful_votes,
 reviews.review_traveler_type,
 reviews.review_title,
 reviews.reivew_body,
 reviews.review_rating,
 reviews.review_views,
 reviews.review_language,
 pictures.picture_url,
 pictures.picture_alt_tag

 FROM reviews

 INNER JOIN pictures

 ON reviews.review_id = pictures.review_id

 WHERE reviews.review_id = ${destId}`