% Player vs Player
playPLPL :-
	initialBoard(X),
	mainRecursivePLPL(X, 1, 0, 0).


% Checks the board needs to be resized

boardResize([H|T], IndC, IndR, [H4|T4]) :-
	arrayLength(H, Columns), 
	arrayLength([H|T], Rows),
	Col is Columns - 1,
	Row is Rows - 1,
	((IndC =:= 0 ; IndR =:= 0 ; IndC =:= Col ; IndR =:= Row) , 
		addColumnEnd([H|T], [H1|T1]),
		addRowEnd([H1|T1], [H2|T2]),
		addRowStart([H2|T2], [H3|T3]),
		addColumnStart([H3|T3], [H4|T4]); 
		append([], [H|T], [H4|T4])).


% Updates the pieces that were played too

updatePiece([H|T], New, 0, IndCol, Number, Player, Final):-
	updatePieceAux(H, IndCol, Number, Z),
	replace(H, IndCol, [Player,Z], R),
	append([R], T, Q),
	append(New, Q, Final).
updatePiece([H|T], New, IndRow, IndCol, Number, Player, Final):-
	IndRow1 is IndRow - 1,
	append(New, [H], NewT),
	updatePiece(T, NewT, IndRow1, IndCol, Number, Player, Final).
updatePieceAux([[_|T1]|_], 0, Number, Z):-
	Z is T1 - Number.
updatePieceAux([_|T], IndCol, Number, Z):-
	IndCol1 is IndCol - 1,
	updatePieceAux(T, IndCol1, Number, Z).



% Updates the tile to where the piece was played

movePiece([H|T], New, 0, IndCol, Number, Player, Final):-
	replace(H, IndCol, [Player,Number], R),
	append([R], T, Q),
	append(New, Q, Final).
movePiece([H|T], New, IndRow, IndCol, Number, Player, Final):-
	IndRow1 is IndRow-1,
	append(New, [H], NewT),
	movePiece(T, NewT, IndRow1, IndCol, Number, Player, Final).


% Checks the adjacent tiles to a tile (1: there are adjacent pieces; 0: there are not)
checkAdjacents([H|T], IndR, IndC, Flag) :-
	A is IndR + 1,
	B is IndR,
	C is IndR - 1,
	D is IndC + 1,
	E is IndC,
	F is IndC - 1,
	checkPiece([H|T], C, F, P1),
	(P1 =\= 2 , Flag is 1;
		checkPiece([H|T], C, E, P2),
		(P2 =\= 2 , Flag is 1;
			checkPiece([H|T], C, D, P3),	
			(P3 =\= 2 , Flag is 1;
				checkPiece([H|T], B, D, P4),
				(P4 =\= 2 , Flag is 1;
					checkPiece([H|T], A, D, P5),
					(P5 =\= 2 , Flag is 1;
						checkPiece([H|T], A, E, P6),
						(P6 =\= 2 , Flag is 1;
							checkPiece([H|T], A, F, P7),
							(P7 =\= 2 , Flag is 1;
								checkPiece([H|T], B, F, P8),
								(P8 =\= 2 , Flag is 1;
								Flag is 0)
							)
						)
					)
				)
			)
		)
	).


% Checks the L moves (1: it is an L move; 0: it is not)
checkLPlay([H|T], C1, R1, C2, R2, Flag) :-
	A is C1 - 2,
	B is C1 - 1,
	C is C1 + 1,
	D is C1 + 2,
	E is R1 - 2,
	F is R1 - 1,
	G is R1 + 1,
	I is R1 + 2,
	checkInsideBoard([H|T], B, E, F1),
	((C2 =:= B , R2 =:= E , F1 =:= 0) , Flag is 1;
		checkInsideBoard([H|T], C, E, F2),
		((C2 =:= C , R2 =:= E , F2 =:= 0) , Flag is 1;
			checkInsideBoard([H|T], D, F, F3),
			((C2 =:= D , R2 =:= F , F3 =:= 0) , Flag is 1;
				checkInsideBoard([H|T], D, G, F4),
				((C2 =:= D , R2 =:= G , F4 =:= 0) , Flag is 1;
					checkInsideBoard([H|T], C, I, F5),
					((C2 =:= C , R2 =:= I , F5 =:= 0) , Flag is 1;
						checkInsideBoard([H|T], B, I, F6),
						((C2 =:= B , R2 =:= I , F6 =:= 0) , Flag is 1;
							checkInsideBoard([H|T], A, G, F7),
							((C2 =:= A , R2 =:= G , F7 =:= 0) , Flag is 1;
								checkInsideBoard([H|T], A, F, F8),
								((C2 =:= A , R2 =:= F , F8 =:= 0) , Flag is 1;
								Flag is 0)
							)
						)
					)
				)
			)
		)
	).


% Checks all the conditions to see whether a piece is valid to be played (1: with errors; 0: can proceed)
checkStackConditions([H|T], Col, Row, Player, Flag) :-
	checkInsideBoard([H|T], Col, Row, F1),
	(F1 =:= 1 , write('The tile must belong to the board!'), nl, Flag is 1;
		checkPiece([H|T], Row, Col, F2),
		(F2 =\= Player , write('The tile is empty or belongs to another player!'), nl, Flag is 1;
			checkNumber([H|T], Row, Col, Number),
			(Number = 1 , write('The tile only contains one piece, it cant be moved!'), nl, Flag is 1;
			Flag is 0
			)
		)
	).


% Checks all the conditions to see whether a tile is valid to be played to (1: with errors; 0: can proceed)
checkTileConditions([H|T], C1, R1, C2, R2, Flag) :-
	checkInsideBoard([H|T], C2, R2, F1),
	(F1 =:= 1 , write('The tile must belong to the board'), nl, Flag is 1;
		checkPiece([H|T], R2, C2, F2),
		(F2 =\= 2 , write('The tile must be empty'), nl, Flag is 1;
			checkLPlay([H|T], C1, R1, C2, R2, F3),
			(F3 =:= 0 , write('The play must be in an L shape'), nl, Flag is 1;
				checkAdjacents([H|T], R2, C2, F4),
				(F4 =:= 0 , write('The tile must have adjacent pieces'), nl, Flag is 1;
					Flag is 0
				)
			)
		)
	).


% Checks whether the number of pieces to be moved is valid (1: invalid number; 0: valid)
checkNPConditions([H|T], Col, Row, Number, Flag, Counter) :-
	(Counter =:= 1 , 
		(Number =\= 1 , 
			write('You can only move 1 piece in the first move'), nl,
			Flag is 1;
			Flag is 0
		);
		checkNumber([H|T], Col, Row, N),
		MaxNum is N - 1,
		((Number @> MaxNum ; Number @< 1) , 
			write('The number of pieces to be moved from this tile must be between 1 and '), 
			write(MaxNum), nl,
			Flag is 1;
			Flag is 0
		)
	).


% Executes a play/move in a board Board, returning the result in another board Board1
move(Board, Player, C1, R1, C2, R2, Np, Board1) :-
	(Player \= 0, 
		makeMoveB(Board, C1, R1, C2, R2, Np, Board1); 
		makeMoveW(Board, C1, R1, C2, R2, Np, Board1)
	).


% Moves a black piece
makeMoveB([H|T], C1, R1, C2, R2, NP, Z):-
	updatePiece([H|T], [], R1, C1, NP, black, Z1),
	movePiece(Z1, [], R2, C2, NP, black, Z2),
	boardResize(Z2, C2, R2, Z).
% Moves a white piece
makeMoveW([H|T], C1, R1, C2, R2, NP, Z):-
	updatePiece([H|T], [], R1, C1, NP, white, Z1),
	movePiece(Z1, [], R2, C2, NP, white, Z2),
	boardResize(Z2, C2, R2, Z).


% Checks 4 consecutive pieces of the same player in any direction (1: win; 0: didnt win)
check(X, Row, Col, Player, Win):-

	checkHorizontal(X, Row, Col, Player, Win1),
	checkVertical(X, Row, Col, Player, Win2),
	checkDiagonal1(X, Row, Col, Player, Win3),
	checkDiagonal2(X, Row, Col, Player, Win4),
	((Win1 = 1; Win2 = 1; Win3 = 1; Win4 = 1) , Win is 1 ; Win is 0).

% Checks 4 consecutive pieces of the same player in the horizontal (1: win; 0: didnt win)
checkHorizontal(X, Row, Col, Player, Win):-
	A is Col+1,
	B is Col+2,
	C is Col+3,

	checkInsideBoard(X, A, Row, F1),
	checkInsideBoard(X, B, Row, F2),
	checkInsideBoard(X, C, Row, F3),

	((F1 = 0, F2 = 0, F3 = 0) , 
		checkPiece(X, Row, A, P1),
		checkPiece(X, Row, B, P2),
		checkPiece(X, Row, C, P3),
		((P1 = Player, P2 = Player, P3 = Player) , Win is 1; Win is 0)
	; Win is 0
	).

% Checks 4 consecutive pieces of the same player in the vertical (1: win; 0: didnt win)
checkVertical(X, Row, Col, Player, Win):-
	A is Row+1,
	B is Row+2,
	C is Row+3,

	checkInsideBoard(X, Col, A, F1),
	checkInsideBoard(X, Col, B, F2),
	checkInsideBoard(X, Col, C, F3),

	((F1 = 0, F2 = 0, F3 = 0) , 
		checkPiece(X, A, Col, P1),
		checkPiece(X, B, Col, P2),
		checkPiece(X, C, Col, P3),
		((P1 = Player, P2 = Player, P3 = Player) , Win is 1; Win is 0)
	; Win is 0
	).

% Checks 4 consecutive pieces of the same player in the first diagonal (1: win; 0: didnt win)
checkDiagonal1(X, Row, Col, Player, Win):-
	R1 is Row+1,
	C1 is Col+1,
	
	R2 is R1+1,
	C2 is C1+1,

	R3 is R2+1,
	C3 is C2+1,

	checkInsideBoard(X, R1, C1, F1),
	checkInsideBoard(X, R2, C2, F2),
	checkInsideBoard(X, R3, C3, F3),

	((F1 = 0, F2 = 0, F3 = 0) , 
		checkPiece(X, R1, C1, P1),
		checkPiece(X, R2, C2, P2),
		checkPiece(X, R3, C3, P3),
		((P1 = Player, P2 = Player, P3 = Player) , Win is 1; Win is 0)
	; Win is 0
	).

% Checks 4 consecutive pieces of the same player in the second diagonal (1: win; 0: didnt win)
checkDiagonal2(X, Row, Col, Player, Win):-
	R1 is Row+1,
	C1 is Col-1,
	
	R2 is R1+1,
	C2 is C1-1,

	R3 is R2+1,
	C3 is C2-1,

	checkInsideBoard(X, R1, C1, F1),
	checkInsideBoard(X, R2, C2, F2),
	checkInsideBoard(X, R3, C3, F3),

	((F1 = 0, F2 = 0, F3 = 0) , 
		checkPiece(X, R1, C1, P1),
		checkPiece(X, R2, C2, P2),
		checkPiece(X, R3, C3, P3),
		((P1 = Player, P2 = Player, P3 = Player) , Win is 1; Win is 0)
	; Win is 0
	).


% Checks whether a player Player has either won/lost the game
game_over(X, Player, MaxRow, MaxCol, Win, Lose) :-
	checkWin(X, Player, MaxRow, MaxCol, 0, 0, Win),
	checkIfPossible(X, Player, MaxRow, MaxCol, 0, 0, Lose).

% Checks the whole win condition

checkWin(_, _, MaxRow, MaxCol, MaxRow, MaxCol, Win):-
	Win is 0.
checkWin(X, Player, MaxRow, MaxCol, Row, Col, Win):-
	checkPiece(X, Row, Col, Flag),
	Col1 is Col+1,
	(Flag =:= Player , 
		check(X, Row, Col, Player, W1),
		(W1 =:= 1 , 
			Win is 1; 
			(Col =:= MaxCol , 
				Row1 is Row +1, 
				checkWin(X, Player, MaxRow, MaxCol, Row1, 0, Win); 
				checkWin(X, Player, MaxRow, MaxCol, Row, Col1, Win)
			)
		);
		(Col = MaxCol , 
			Row1 is Row + 1, 
			checkWin(X, Player, MaxRow, MaxCol, Row1, 0, Win);
			checkWin(X, Player, MaxRow, MaxCol, Row, Col1, Win)
		)
	).

% Checks whether a player still has pieces to move (1: No more pieces; 0: Still has pieces)

checkIfPossible(_, _, MaxRow, MaxCol, MaxRow, MaxCol, Lose):-
	Lose is 1.
checkIfPossible(X, Player, MaxRow, MaxCol, Row, Col, Lose):-
	checkPiece(X, Row, Col, Flag),
	Col1 is Col+1,
	(Flag =:= Player , 
		checkNumber(X, Row, Col, Num),
		(Num \= 1 , 
			Lose is 0; 
			(Col =:= MaxCol , 
				Row1 is Row +1, 
				checkIfPossible(X, Player, MaxRow, MaxCol, Row1, 0, Lose); 
				checkIfPossible(X, Player, MaxRow, MaxCol, Row, Col1, Lose)
			)
		);
		(Col = MaxCol , 
			Row1 is Row + 1, 
			checkIfPossible(X, Player, MaxRow, MaxCol, Row1, 0, Lose);
			checkIfPossible(X, Player, MaxRow, MaxCol, Row, Col1, Lose)
		)
	).


% Recursive function that takes care of the Player vs Player type of game
mainRecursivePLPL(_, _, 1, _):-
	winningMessage.
mainRecursivePLPL(_, _, _, 1):-
	noPiecesMessage.
mainRecursivePLPL(Board, Counter, _, _) :-
	write('\33\[2J'),
	display_game(Board),
	Player is Counter mod 2,
	(Player \= 0 , turn(1), nl ; turn(0), nl ),
 	
	chooseStack(Board, C1, R1, Player),
	chooseWhereToMove(Board, C1, R1, C2, R2, Player),
	chooseNumberPieces(Board, C1, R1, Np, Counter),

	move(Board, Player, C1, R1, C2, R2, Np, Board1),

	checkLengths(Board1, MaxRow, MaxCol),
	game_over(Board1, Player, MaxRow, MaxCol, WinAux, LoseAux),

	display_game(Board1),

	Counter1 is Counter + 1,
	mainRecursivePLPL(Board1, Counter1, WinAux, LoseAux).