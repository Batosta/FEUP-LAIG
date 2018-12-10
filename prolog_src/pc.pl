% Player vs Computer
playPLPC(Level) :-
	initialBoard(X),
	mainRecursivePLPC(Level, X, 1, 0, 0).

% Computer vs Computer
playPCPC :-
	initialBoard(X),
	mainRecursivePCPC(X, 1, 0, 0).


%---------------------------- Functions that relate to the random bot ---------------------------------------------

% Chooses a random stack to be played. The stack will belong to the player Player. Also chooses a random number of pieces.
chooseRandomPieceNumber(X, Player, ColSize, RowSize, Col, Row, Number) :-
	random(0, ColSize, C1),
	random(0, RowSize, R1),
	checkPiece(X, R1, C1, F1),
	(F1 =\= Player ,
		chooseRandomPieceNumber(X, Player, ColSize, RowSize, Col, Row, Number);
		checkNumber(X, R1, C1, MaxNum),
		(MaxNum =:= 1 ,
			chooseRandomPieceNumber(X, Player, ColSize, RowSize, Col, Row, Number);
			random(1, MaxNum, Number),
			Col is C1,
			Row is R1
		)
	).


% Chooses a random move in the L shape, starting in a certain stack

chooseRandomLMove(X, Player, ColSize, RowSize, PieceC, PieceR, TileC, TileR) :-
	random(0, ColSize, C2),
	random(0, RowSize, R2),
	checkPiece(X, R2, C2, F1),
	(F1 =\= 2 ,
		chooseRandomLMove(X, Player, ColSize, RowSize, PieceC, PieceR, TileC, TileR);
		checkLPlay(X, PieceC, PieceR, C2, R2, F2),
		(F2 =\= 1 ,
			chooseRandomLMove(X, Player, ColSize, RowSize, PieceC, PieceR, TileC, TileR);
			checkAdjacents(X, R2, C2, F3),
			(F3 =\= 1 ,
				chooseRandomLMove(X, Player, ColSize, RowSize, PieceC, PieceR, TileC, TileR);
				TileC is C2,
				TileR is R2
			)
		)
	).


% Returns the position of the stack + number of pieces to be played + position to where they will be played

pcMoveRandom(X, Player, C1, R1, C2, R2, Np) :-
	checkLengths(X, RowSize, ColSize),
	chooseRandomPieceNumber(X, Player, ColSize, RowSize, C1, R1, Np),
	chooseRandomLMove(X, Player, ColSize, RowSize, C1, R1, C2, R2).






%---------------------------- Functions that relate to the smart bot ---------------------------------------------

% Function that will take care of choosing the positions of the tiles from where + to where the smart bot will play
pcMove(_, _, -1, _, _).
pcMove(X, 0, Max, From, To):-

	checkEmpty(X, X, 0, 0, Max, [], Jog, 0),
	getWhites(X, 0, 0, [], Coords),

	botCoordinates(X, Jog, Coords, Coords, Piece, Tile),
	((Piece = [], Tile = []) , 
		Max1 is Max-1, 
		pcMove(X, 0, Max1, From, To); 
		From = Piece, 
		To = Tile
	).
pcMove(X, 1, Max, From, To):-

	checkEmpty(X, X, 0, 0, Max, [], Jog, 1),
	getBlacks(X, 0, 0, [], Coords),

	botCoordinates(X, Jog, Coords, Coords, Piece, Tile),
	((Piece = [], Tile = []) , 
		Max1 is Max-1, 
		pcMove(X, 1, Max1, From, To); 
		From = Piece, 
		To = Tile
	).


% Checks the number of the Player pieces in the horizontal, checking right side
checkNumberHorizontalRight(X, Player, Col, Row, Right) :-
	A is Col + 1,
	checkPiece(X, Row, A, P1),
	(P1 =:= Player ,
		B is Col + 2,
		checkPiece(X, Row, B, P2),
		(P2 =:= Player ,
			C is Col + 3,
			checkPiece(X, Row, C, P3),
			(P3 =:= Player ,
				Right is 3;
				Right is 2
			);
			Right is 1
		);
		Right is 0
	).
% Checks the number of the Player pieces in the horizontal, checking left side
checkNumberHorizontalLeft(X, Player, Col, Row, Left) :-
	D is Col - 1,
	checkPiece(X, Row, D, P4),
	(P4 =:= Player ,
		E is Col - 2,
		checkPiece(X, Row, E, P5),
		(P5 =:= Player ,
			F is Col - 3,
			checkPiece(X, Row, F, P6),
			(P6 =:= Player ,
				Left is 3;
				Left is 2
			);
			Left is 1
		);
		Left is 0
	).
% Checks the number of the Player pieces in the horizontal, checking both sides
checkNumberHorizontal(X, Player, Col, Row, Number) :-
	
	checkNumberHorizontalRight(X, Player, Col, Row, Right),
	checkNumberHorizontalLeft(X, Player, Col, Row, Left),

	NumbAux is Left + Right,
	(NumbAux @> 3 ,
		Number is 3;
		Number is NumbAux
	).


% Checks the number of the Player pieces in the vertical, checking upwards
checkNumberVerticalUp(X, Player, Col, Row, Up) :-
	A is Row - 1,
	checkPiece(X, A, Col, P1),
	(P1 =:= Player ,
		B is Row - 2,
		checkPiece(X, B, Col, P2),
		(P2 =:= Player ,
			C is Row - 3,
			checkPiece(X, C, Col, P3),
			(P3 =:= Player ,
				Up is 3;
				Up is 2
			);
			Up is 1
		);
		Up is 0
	).
% Checks the number of the Player pieces in the vertical, checking downwards
checkNumberVerticalDown(X, Player, Col, Row, Down) :-
	D is Row + 1,
	checkPiece(X, D, Col, P4),
	(P4 =:= Player ,
		E is Row + 2,
		checkPiece(X, E, Col, P5),
		(P5 =:= Player ,
			F is Row + 3,
			checkPiece(X, F, Col, P6),
			(P6 =:= Player ,
				Down is 3;
				Down is 2
			);
			Down is 1
		);
		Down is 0
	).
% Checks the number of the Player pieces in the vertical, checking both sides
checkNumberVertical(X, Player, Col, Row, Number) :-
	
	checkNumberVerticalUp(X, Player, Col, Row, Up),
	checkNumberVerticalDown(X, Player, Col, Row, Down),

	NumbAux is Up + Down,
	(NumbAux @> 3 ,
		Number is 3;
		Number is NumbAux
	).


% Checks the number of the Player pieces in the diagonal 1, checking right downwards
checkNumberDiagonal1RightDown(X, Player, Col, Row, RightDown) :-
	A1 is Row + 1,
	A2 is Col + 1, 
	checkPiece(X, A1, A2, P1),
	(P1 =:= Player ,
		B1 is Row + 2,
		B2 is Col + 2,
		checkPiece(X, B1, B2, P2),
		(P2 =:= Player ,
			C1 is Row + 3,
			C2 is Row + 3,
			checkPiece(X, C1, C2, P3),
			(P3 =:= Player ,
				RightDown is 3;
				RightDown is 2
			);
			RightDown is 1
		);
		RightDown is 0
	).
% Checks the number of the Player pieces in the diagonal 1, checking left upwards
checkNumberDiagonal1LeftUp(X, Player, Col, Row, LeftUp) :-
	A1 is Row - 1,
	A2 is Col - 1, 
	checkPiece(X, A1, A2, P1),
	(P1 =:= Player ,
		B1 is Row - 2,
		B2 is Col - 2,
		checkPiece(X, B1, B2, P2),
		(P2 =:= Player ,
			C1 is Row - 3,
			C2 is Row - 3,
			checkPiece(X, C1, C2, P3),
			(P3 =:= Player ,
				LeftUp is 3;
				LeftUp is 2
			);
			LeftUp is 1
		);
		LeftUp is 0
	).
% Checks the number of the Player pieces in the diagonal 1, checking both sides
checkNumberDiagonal1(X, Player, Col, Row, Number) :-
	
	checkNumberDiagonal1RightDown(X, Player, Col, Row, RightDown),
	checkNumberDiagonal1LeftUp(X, Player, Col, Row, LeftUp),

	NumbAux is RightDown + LeftUp,
	(NumbAux @> 3 ,
		Number is 3;
		Number is NumbAux
	).


% Checks the number of the Player pieces in the diagonal 1, checking right upwards
checkNumberDiagonal2RightUp(X, Player, Col, Row, RightUp) :-
	A1 is Row - 1,
	A2 is Col + 1, 
	checkPiece(X, A1, A2, P1),
	(P1 =:= Player ,
		B1 is Row - 2,
		B2 is Col + 2,
		checkPiece(X, B1, B2, P2),
		(P2 =:= Player ,
			C1 is Row - 3,
			C2 is Row + 3,
			checkPiece(X, C1, C2, P3),
			(P3 =:= Player ,
				RightUp is 3;
				RightUp is 2
			);
			RightUp is 1
		);
		RightUp is 0
	).
% Checks the number of the Player pieces in the diagonal 1, checking left downwards
checkNumberDiagonal2LeftDown(X, Player, Col, Row, LeftDown) :-
	A1 is Row + 1,
	A2 is Col - 1, 
	checkPiece(X, A1, A2, P1),
	(P1 =:= Player ,
		B1 is Row + 2,
		B2 is Col - 2,
		checkPiece(X, B1, B2, P2),
		(P2 =:= Player ,
			C1 is Row + 3,
			C2 is Row - 3,
			checkPiece(X, C1, C2, P3),
			(P3 =:= Player ,
				LeftDown is 3;
				LeftDown is 2
			);
			LeftDown is 1
		);
		LeftDown is 0
	).
% Checks the number of the Player pieces in the diagonal 2, checking both sides
checkNumberDiagonal2(X, Player, Col, Row, Number) :-
	
	checkNumberDiagonal2RightUp(X, Player, Col, Row, RightUp),
	checkNumberDiagonal2LeftDown(X, Player, Col, Row, LeftDown),

	NumbAux is RightUp + LeftDown,
	(NumbAux @> 3 ,
		Number is 3;
		Number is NumbAux
	).


% Checks the number of the Player pieces in any direction, checking both sides (0: Success in function of the Max value; 1: Insuccess)
checkAll(X, Player, Col, Row, Max, Flag):-
	checkNumberHorizontal(X, Player, Col, Row, N1),
	checkNumberVertical(X, Player, Col, Row, N2),
	checkNumberDiagonal1(X, Player, Col, Row, N3),
	checkNumberDiagonal2(X, Player, Col, Row, N4),
	((N1 = Max ; N2 = Max; N3 = Max; N4 = Max), 
		Flag is 0;
		Flag is 1
	).


% Returns an array with the coordinates of all the white pieces
getWhites([], _, _, Temp, Coords):-
	append([], Temp, Coords).
getWhites([H|T], Row, Col, Temp, Coords):-
	getWhitesAux(H, Row, Col, Aux, []),
	Row1 is Row+1,
	append(Temp, Aux, Coords1),
	getWhites(T, Row1, 0, Coords1, Coords).
getWhitesAux([], _, _, Aux, Coords):-
	append([], Coords, Aux).
getWhitesAux([[H|[H1|[]]]|T], Row, Col, Aux, Coords):-
	Col1 is Col+1,
	((H = white, H1 @> 1) , 
		append(Coords, [[Row, Col]], Coords1), 
		getWhitesAux(T, Row, Col1, Aux, Coords1); 
		getWhitesAux(T, Row, Col1, Aux, Coords)).

% Returns an array with the coordinates of all the black pieces
getBlacks([], _, _, Temp, Coords):-
	append([], Temp, Coords).
getBlacks([H|T], Row, Col, Temp, Coords):-
	getBlacksAux(H, Row, Col, Aux, []),
	Row1 is Row+1,
	append(Temp, Aux, Coords1),
	getBlacks(T, Row1, 0, Coords1, Coords).
getBlacksAux([], _, _, Aux, Coords):-
	append([], Coords, Aux).
getBlacksAux([[H|[H1|[]]]|T], Row, Col, Aux, Coords):-
	Col1 is Col+1,
	((H = black, H1 @> 1) , 
		append(Coords, [[Row, Col]], Coords1), 
		getBlacksAux(T, Row, Col1, Aux, Coords1); 
		getBlacksAux(T, Row, Col1, Aux, Coords)).


% Iterates the whole board, trying to find empty pieces that have a Max pieces of the same color in the adjacents tiles.
% Returns an array with all the empty pieces, in function of the Max.
checkEmpty([], _, _, _, _, Aux, Jog, _):-
	append([], Aux, Jog).
checkEmpty([H|T], X, Row, Col, Max, Temp, Jog, Player):-
	Row1 is Row+1,
	checkEmptyAux(H, X, Row, Col, Max, Aux, [], Player),
	append(Temp, Aux, Jog1),
	checkEmpty(T, X, Row1, 0, Max, Jog1, Jog, Player).
checkEmptyAux([], _, _, _, _, Aux, Empties, _):-
	append([], Empties, Aux).
checkEmptyAux([[H|_]|T], X, Row, Col, Max, Aux, Empties, Player):-
	Col1 is Col+1,
	(H = empty ,
		checkAll(X, Player, Col, Row, Max, F1),
			(F1 = 0 , 
				append(Empties, [[Row, Col]], Empties1), 
				checkEmptyAux(T, X, Row, Col1, Max, Aux, Empties1, Player) 
				; 
				checkEmptyAux(T, X, Row, Col1, Max, Aux, Empties, Player)
			)
		;
		checkEmptyAux(T, X, Row, Col1, Max, Aux, Empties, Player)
	).


% Receiving an array with the coordinates of all the pieces with the same color, iterates that array.
% Also receives an array with the coordinates of all the empty tiles with Max pieces in the adjacent tiles.
% In every piece, we check whether there is an L move from it to an empty tile of the above.
% If there is an L move, we move it right away. If not, we keep searching
botCoordinates(_, [], _, _, Piece, Tile):-
	Tile = [],
	Piece = [].
botCoordinates(X, [_|T1], [], Y, Piece, Tile):-
	botCoordinates(X, T1, Y, Y, Piece, Tile).
botCoordinates(X, [H1|T1], [H2|T2], Y, Piece, Tile):-
	botCoordinatesAux(X, H1, H2, F),
	(F = 1 , 
		Tile = H1,
		Piece = H2
	;
		botCoordinates(X, [H1|T1], T2, Y, Piece, Tile)
	).
botCoordinatesAux(X, [H|T], [H1|T1], Flag):-
	checkLPlay(X, H, T, H1, T1, F),
	checkAdjacents(X, H, T, F1),
	((F = 1, F1 = 1) , Flag is 1 ; Flag is 0).


% Chooses the play to be made by the computer, taking into account its level of difficulty
choose_move(Board, Player, Level, C1, R1, C2, R2, Np, Counter) :-
	(Level =:= 1,
		pcMoveRandom(Board, Player, C1, R1, C2, R2, Np);

		pcMove(Board, Player, 3, [H|[H1|[]]], [H2|[H3|[]]]),
		C1 = H1, 
		R1 = H, 
		C2 = H3, 
		R2 = H2,
		(Counter =:= 1,
			Np is 1;
			checkNumber(Board, R1, C1, MaxN),
			random(1, MaxN, Np)
		)
	).


% Recursive function that takes care of the Player vs Computer type of game
mainRecursivePLPC(_, _, _, 1, _):-
	winningMessage.
mainRecursivePLPC(_, _, _, _, 1):-
	noPiecesMessage.
mainRecursivePLPC(Level, Board, Counter, _, _) :-
	
	write('\33\[2J'),
	display_game(Board),
	Player is Counter mod 2,

	(Player \= 0 , 
		turn(1), nl,
		chooseStack(Board, C1, R1, Player),
		chooseWhereToMove(Board, C1, R1, C2, R2, Player),
		chooseNumberPieces(Board, C1, R1, Np, Counter);

		turn(0), nl,
		choose_move(Board, Player, Level, C1, R1, C2, R2, Np, Counter)
	),

	move(Board, Player, C1, R1, C2, R2, Np, Board1), 

	checkLengths(Board1, MaxRow, MaxCol),
	game_over(Board1, Player, MaxRow, MaxCol, WinAux, LoseAux),

	display_game(Board1),

	Counter1 is Counter + 1,
	mainRecursivePLPC(Level, Board1, Counter1, WinAux, LoseAux).

% Recursive function that takes care of the Computer vs Computer type of game
mainRecursivePCPC(_, _, 1, _):-
	winningMessage.
mainRecursivePCPC(_, _, _, 1):-
	noPiecesMessage.
mainRecursivePCPC(Board, Counter, _, _) :-

	write('\33\[2J'),
	display_game(Board),
	Player is Counter mod 2,

	turn(Player), nl,
	choose_move(Board, Player, 2, C1, R1, C2, R2, Np, Counter),
	move(Board, Player, C1, R1, C2, R2, Np, Board1),

	sleep(3),

	checkLengths(Board1, MaxRow, MaxCol),
	game_over(Board1, Player, MaxRow, MaxCol, WinAux, LoseAux),

	display_game(Board1),

	Counter1 is Counter + 1,
	mainRecursivePCPC(Board1, Counter1, WinAux, LoseAux).