module.exports = {
  cafeList: `select * from cafe`,
  cafeDetail: `SELECT * FROM cafe WHERE cafe_id = ?`,
  cafeDelete: ``,
  cafeBrewingOption: `SELECT t3.brewing_name 
  FROM cafe t1, cafe_brewing_option t2, brewing_option t3
  WHERE t1.cafe_id = ? and t1.cafe_id = t2.cafe_id and t2.brewing_option_id = t3.brewing_option_id`,

  userList: `select * from user`,
  userCreate: `insert into user set ?`,
};
