INSERT INTO users(firstname, lastname, email, password, is_active)
VALUES 
('Elon', 'Musk', 'elon.musk@tesla.com', crypt('Gunsmoke&Lav1', gen_salt('bf')), true),
('Harry', 'Potter', 'harry.potter@gmail.com', crypt('Gunsmoke&Lav1', gen_salt('bf')), true),
('Anna', 'Karenina', 'anna.karenina@gmail.com', crypt('Gunsmoke&Lav1', gen_salt('bf')), true),
('Scarlett', 'Ohara', 'scarlett.ohara@gmail.com', crypt('Gunsmoke&Lav1', gen_salt('bf')), true),
('Elza', 'Oldenburg', 'elsa@frozen.com', crypt('Gunsmoke&Lav1', gen_salt('bf')), true);

INSERT INTO ratings(movie_id, user_id, rating_value, create_at)
VALUES
(527774, 1, 4, '2021-03-01 09:30:00+11'),
(484718, 1, 3, '2021-03-01 10:45:00+11'),
(581389, 1, 2, '2021-03-02 18:30:00+11'),
(464052, 1, 1, '2021-03-02 21:45:00+11'),
(560144, 2, 5, '2021-03-03 05:30:00+11'),
(577922, 2, 3, '2021-03-03 11:45:00+11'),
(464052, 2, 4, '2021-03-04 13:30:00+11'),
(539885, 2, 5, '2021-03-04 19:45:00+11'),
(577922, 3, 3, '2021-03-05 20:30:00+11'),
(755812, 3, 2, '2021-03-05 09:45:00+11'),
(495764, 3, 0, '2021-03-06 10:30:00+11'),
(484718, 3, 4, '2021-03-06 18:45:00+11'),
(560144, 4, 1, '2021-03-07 21:30:00+11'),
(581389, 4, 3, '2021-03-07 05:45:00+11'),
(529203, 4, 5, '2021-03-08 07:30:00+11'),
(755812, 4, 3, '2021-03-08 08:45:00+11'),
(527774, 5, 4, '2021-03-09 15:30:00+11'),
(539885, 5, 4, '2021-03-09 19:45:00+11'),
(495764, 5, 1, '2021-03-10 11:30:00+11'),
(529203, 5, 5, '2021-03-10 23:45:00+11');