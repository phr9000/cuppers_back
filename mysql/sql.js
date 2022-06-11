module.exports = {
  cafeList: `select * from cafe`,
  cafeDetail: `SELECT * FROM cafe WHERE cafe_id = ?`,
  cafeDelete: ``,
  cafeImage: `SELECT t2.type, t2.cafe_image_url
  FROM cafe t1, images_cafe t2
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id`,
  cafeBrewingOption: `SELECT t3.brewing_name 
  FROM cafe t1, cafe_brewing_option t2, brewing_option t3
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id and t2.brewing_option_id = t3.brewing_option_id`,
  cafeOperationTime: `SELECT t2.operation_day, t2.operation_time
  FROM cafe t1, cafe_operation_time t2
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id`,
  // 활성 조건 추가해야 함
  cafeKeyword: `SELECT t3.keyword_name, t3.keyword_icon
  FROM cafe t1, cafe_keyword t2, keyword t3
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id and t2.keyword_id = t3.keyword_id`,
  cafeMenu: `SELECT t2.*
  FROM cafe t1, menu t2
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id`,
  cafeFacility: `SELECT t3.facility_name, t3.facility_icon, t3.facility_type
  FROM cafe t1, cafe_facility t2, facility t3
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id and t2.facility_id = t3.facility_id`,
  cafeLikeIt: `SELECT COUNT(*) as count
  FROM user_cafe_likeit
  WHERE cafe_id = ?`,
  userList: `select * from user`,
  userCreate: `insert into user set ?`,
};
