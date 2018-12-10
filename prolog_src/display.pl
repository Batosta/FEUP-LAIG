% Initial board
initialBoard([
[[empty, 0], [empty, 0], [empty, 0], [empty, 0]],
[[empty, 0], [black, 20], [white, 20], [empty, 0]],
[[empty, 0], [empty, 0], [empty, 0], [empty, 0]]
]).

% Test board
testBoard([
[[empty, 0], [empty, 0], [empty, 0], [empty, 0], [empty, 0], [empty, 0], [empty, 0]],
[[empty, 0], [white, 3], [black, 3], [white, 5], [empty, 0], [empty, 0], [empty, 0]],
[[empty, 0], [white, 3], [black, 3], [black, 2], [white, 1], [empty, 0], [empty, 0]],
[[empty, 0], [black, 4], [black, 4], [white, 4], [black, 4], [white, 4], [empty, 0]],
[[empty, 0], [empty, 0], [empty, 0], [empty, 0], [empty, 0], [empty, 0], [empty, 0]]
]).


% Symbols meaning
symbol(white, S) :- S='O'.
symbol(black, S) :- S='X'.
letter(1, S) :- S='A'.
letter(2, S) :- S='B'.
letter(3, S) :- S='C'.
letter(4, S) :- S='D'.
letter(5, S) :- S='E'.
letter(6, S) :- S='F'.
letter(7, S) :- S='G'.
letter(8, S) :- S='H'.
letter(9, S) :- S='I'.
letter(10, S) :- S='J'.
letter(11, S) :- S='K'.
letter(12, S) :- S='L'.
letter(13, S) :- S='M'.
letter(14, S) :- S='N'.
letter(15, S) :- S='O'.
letter(16, S) :- S='P'.
letter(17, S) :- S='Q'.
letter(18, S) :- S='R'.
letter(19, S) :- S='S'.
letter(20, S) :- S='T'.
letter(21, S) :- S='U'.
letter(22, S) :- S='V'.
letter(23, S) :- S='W'.
letter(24, S) :- S='X'.
letter(25, S) :- S='Y'.
letter(26, S) :- S='Z'.

% Prints any board

display_game([H|T]) :-

	arrayLength(H, Columns),

	nl, write('|'), separation(Columns), write('|'), nl,
	write('|/////|   '), tableTop(Columns, 0), nl,
	write('|'), separation(Columns), write('|'),
	printBoard([H|T], Columns, 0, 1), nl, nl.


% Prints the pieces plus its number (Head is a full row)
printBoard([], _, _, _).
printBoard([H|T], C, R, N) :-
	nl,
	N1 is N + 1,
	R1 is R + 1,
	letter(R1, S),
	write('|  '), write(S), write('  |  '), printRow(H), nl, 
	write('|'), separation(C), write('|'),
	printBoard(T, C, R1, N1).


% Prints a full row (Head is a pair of atoms)
printRow([]).
printRow([H|T]) :-
	printPair(H),
	printRow(T).


% Prints a pair (Head is the color of the tile)
printPair([empty|_]) :-
	write('    | ').
printPair([H|T]) :-
	symbol(H, S),
	write(S),
	printNumber(T).


% Prints the number in a pair (Head is the number)
printNumber([]).
printNumber([H|_]) :-
	(H > 9 ,
		write(','), write(H), write('| '); 
		write(','), write(H), write(' | ')).


% Prints the top of the table (column references)
tableTop(C, C).
tableTop(C, X) :-
	write(X), write('  |  '),
	X1 is X + 1,
	tableTop(C, X1).


% Prints the separation between 2 rows
separation(-1).
separation(C) :-
	write('------'),
	C1 is C - 1,
	separation(C1).
