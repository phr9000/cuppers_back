module.exports = {
  cafeList: `SELECT t1.cafe_id, t1.cafe_name_pr, t1.cafe_address, t1.cafe_region, t1.cafe_latitude, t1.cafe_longitude, t1.cafe_description, t1.cafe_type, t1.cafe_img, 
  (
    SELECT COUNT(*) 
    FROM user_cafe_likeit t2
    WHERE t2.cafe_id = t1.cafe_id
    ) as likeit,
    (
      SELECT COUNT(*) 
    FROM review t3
    WHERE t3.cafe_id = t1.cafe_id
    ) as reviews
  FROM cafe t1
  LIMIT 10`,
  cafeListKeyword: `SELECT t1.cafe_id, t3.keyword_id, t3.keyword_name
  FROM cafe t1, cafe_keyword t2, keyword t3
  WHERE t1.cafe_id = t2.cafe_id and t2.keyword_id = t3.keyword_id`,
  cafeListOpTime: `SELECT t2.cafe_id, t2.operation_day as day, t2.operation_time as time
  FROM cafe t1, cafe_operation_time t2
  WHERE t1.cafe_id = t2.cafe_id`,
  cafeDetail: `SELECT *,
  (
    SELECT COUNT(*) 
    FROM user_cafe_likeit t2
    WHERE t2.cafe_id = t1.cafe_id
    ) as likeit
  FROM cafe t1
  WHERE cafe_id = ?`,
  cafeDelete: ``,
  cafeImage: `SELECT t2.*
  FROM cafe t1, images_cafe t2
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id`,
  cafeBrewingOption: `SELECT t3.brewing_name as name, t3.brewing_icon as icon 
  FROM cafe t1, cafe_brewing_option t2, brewing_option t3
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id and t2.brewing_option_id = t3.brewing_option_id`,
  cafeOpTime: `SELECT t2.operation_day as day, t2.operation_time as time
  FROM cafe t1, cafe_operation_time t2
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id`,
  // 활성 조건 추가해야 함
  cafeKeyword: `SELECT t3.keyword_name as name, t3.keyword_icon as icon
  FROM cafe t1, cafe_keyword t2, keyword t3
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id and t2.keyword_id = t3.keyword_id`,
  cafeMenu: `SELECT t2.*
  FROM cafe t1, menu t2
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id`,
  cafeFacility: `SELECT t3.facility_name as name, t3.facility_icon as icon, t3.facility_type as type
  FROM cafe t1, cafe_facility t2, facility t3
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id and t2.facility_id = t3.facility_id`,
  cafeReview: `SELECT t1.*, t2.user_nickname, t3.images_review_url as thumbnail_url,
  (
    SELECT COUNT(*) 
    FROM user_review_likeit t4
    WHERE t4.review_id = t1.review_id
    ) as likeit
 
  FROM review t1, user t2, images_review t3
  WHERE t1.cafe_id = ? and t1.user_id = t2.user_id and t1.review_id = t3.review_id and t3.isthumbnail = 1`,
  userList: `select * from user`,
  userCreate: `insert into user set ?`,
  // keyword 연결된 커핑노트 새 글 있을 때 new : T 전달하도록 query 수정
  keywordLanding: `SELECT keyword_id, keyword_name, keyword_icon FROM keyword WHERE keyword_islanding=1`,
  cnoteDetail: `SELECT *, 
  (
    SELECT COUNT(*) 
    FROM user_cnote_likeit t2
    WHERE t2.cnote_id = t1.cnote_id
    ) as likeit,
    (
      SELECT COUNT(*) 
    FROM user_cnote_bookmark t3
    WHERE t3.cnote_id = t1.cnote_id
    ) as bookmark
    From cnote t1
    WHERE t1.cnote_id = ?`,
  cnoteImg: `SELECT * FROM images_cnote t1 WHERE t1.cnote_id = ?`,
  cnoteUser: `SELECT t2.user_id, t2.user_introduce, t2.user_nickname, t2.user_thumbnail_url
  FROM cnote t1, user t2
  WHERE t1.cnote_id = ? and t1.user_id = t2.user_id`,
};
