DELIMITER $$

CREATE PROCEDURE CopySchema(IN source_db VARCHAR(64), IN destination_db VARCHAR(64))
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE table_name VARCHAR(64);
    DECLARE cur CURSOR FOR 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = source_db;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO table_name;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SET @create_table_stmt = CONCAT('CREATE TABLE ', destination_db, '.', table_name, ' LIKE ', source_db, '.', table_name, ';');
        PREPARE stmt FROM @create_table_stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

        SET @insert_data_stmt = CONCAT('INSERT INTO ', destination_db, '.', table_name, ' SELECT * FROM ', source_db, '.', table_name, ';');
        PREPARE stmt FROM @insert_data_stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;