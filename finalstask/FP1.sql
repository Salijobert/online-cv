SELECT * FROM shipment_db.shipments_tbl;


SELECT shipment_id,
	proper_case(trim(origin_warehouse)) AS origin_warehouse,
    proper_case(trim(destination_city)) AS destination_city,
    ucase(destination_state) AS destination_state,
    proper_case(trim(carrier)) AS carrier,


--  DESCRIBE shipments_tbl;

str_to_date(delivery_date,'%Y-%m-%d') AS delivery_date,
str_to_date(ship_date,'%Y-%m-%d') AS ship_date,


datediff(delivery_date,ship_date) AS No_of_days_delivered,
CASE 
	WHEN(delivery_date) < (ship_date) THEN 'Invalid'
    WHEN(delivery_date) = (ship_date) THEN 'Same Day Delivery'
    ELSE 'Valid'
END AS delivery_status,

CASE
	when weight_kg < 0 then abs (weight_kg)
    when weight_kg < 0 then 0
    ELSE weight_kg 

END as valid_weight,

row_number() 
over(
partition by origin_warehouse, destination_city, destination_state, 
ship_date, carrier,  
CONVERT(weight_kg, char),
CONVERT(freight_cost, char)
ORDER BY shipment_id) as row_num

FROM shipment_db.shipments_tbl;

DELETE FROM shipments_tbl
WHERE shipment_id IN
	(
	SELECT shipment_id FROM(
		SELECT shipment_id, ROW_NUMBER() OVER
        (PARTITION BY origin_warehouse,destination_city, carrier,
        ship_date ORDER BY shipment_id) as row_num
        FROM shipments_tbl
        ) as sub
        WHERE row_num > 1
        );
        





