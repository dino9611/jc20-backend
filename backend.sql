-- buat database/ or schema 
create DATABASE matoa;

-- pilih database
use matoa; 

-- buat table 
-- CREATE TABLE users (
--     id int NOT NULL AUTO_INCREMENT,
--     LastName varchar(255) NOT NULL,
--     FirstName varchar(255),
--     Age int,
--     PRIMARY KEY (id)
-- );


-- urutan syntax 
 -- select-namacolumn-from-namatable-where - group by- having -order by -limit
 
-- buat get semua column
-- select * from users;
 
-- buat get column tertentu 
-- contoh kasus sql injection
-- select id,firstname from users where username = 'dino'-- ' and password = 'tes'; 

use sakila ;
-- cari film yang rental ratenya kurang dari 3 dan ratingnya bukan pg 
select * from film where rental_rate < 3 and not rating = 'PG' ;

-- cari film yang rental ratenya kurang dari 3 dan ratingnya bukan pg  urutkan judulnya dari Descend

select * from film where rental_rate < 3 and not rating = 'PG' order by title desc ;

-- insert data

-- insert into users 
-- 	(LastName,FirstName,Age)
-- Values
-- 	("rakan","ampuh",24),
-- 	("andhika","prasetyo",24)
	
-- usahakan delete menggunakan where 
-- jika tidak akan terhapus semua
-- delete from users where id = 3;

select * from users;
-- edit usahakan mengggunakan where
update users set lastName = 'aqil' where id=2;
-- limit
select * from actor limit 5;
-- paging data page=1
select * from actor limit 0,5;
-- 0,5,10,15; (page-1)*5
-- page 2
select * from actor limit 5,10;
-- as alias
select *, Date(last_update) as tanggal from actor ;


-- aggregate function
select min(rental_duration) from film where rating='PG' ;
select max(rental_duration) from film;

select count(*) as jumlah_film from film ;
-- jumlah film dengan genre pg-13
select count(*) as jumlah_film_PG_13 from film where rating='PG-13';
-- RATA-RATA
-- rata-rata rental-rate semua film
select avg(rental_rate) as avg_rental_rate from film  ;

-- sum buat total
-- total pendapatan perusahaan dari tabel payment
select sum(amount) as bruto_perusahaan from payment;

-- total pendapatan perusahaan dari tabel payment tahun 2005
select 
	sum(amount) as bruto_perusahaan 
	from payment
    where (payment_date) = 2005 and month(payment_date) = 5;
    
-- cari rata-rata rental_rate dengan rating pg,pg-13
select avg(rental_rate) from film where rating in ('PG','PG-13');

-- cari jumlah replacement_cost dengan rating yang bukan pg,nc-17
select SUM(replacement_cost) from film where rating not in ('PG','NC-17');

-- cari rata-rata rental_rate dikelompokkan setiap rating
select avg(rental_rate),rating from film group by rating;
-- having seperti where cuman untuk table buatan
select *,(amount*1.1) as amount_pajak from payment having amount_pajak <5;

-- subquery
-- subquery values
-- subquery table
-- ingin cari film yang rental_ratenya diatas rata2
select avg(rental_rate)from film; 
-- kalo operatornya selain in maka ekspektasinya subquerynya adalah 1 row dan satu column
select * from film 
where rental_rate >= (select avg(rental_rate),rating from film);

-- film_actor
select actor_id from film_actor where film_id=23;
-- in subquery satu column dan 1 atau lebih untuk row
select * from actor 
	where actor_id in (select actor_id from film_actor where film_id=23);

-- cari film_id yang dimainkan penelope guiness

select actor_id from actor 
	where first_name = 'penelope' and last_name ='guiness';

select * from film_actor 
	where actor_id =( select actor_id from actor 
	where first_name = 'penelope' and last_name ='guiness');


-- like
-- cari aktor yang ada huruf j 
select * from actor 
	where first_name  like '%jo%'


