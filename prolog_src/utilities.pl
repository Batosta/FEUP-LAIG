% Calculates an array size
arrayLength([], 0).
arrayLength([_|T], LenResult) :-
	arrayLength(T, L),
	LenResult is L + 1.

% Calculates the number of columns + rows in a board
checkLengths([H|T], MaxRow, MaxCol):-
	arrayLength([H|T], MaxRow), 
	arrayLength(H, MaxCol).


% Appends a Col number of [empty, 0]
createEmptyRow(P, 0, P).
createEmptyRow(P, Col, R):-
	Col1 is Col - 1,
	append(P, [[empty, 0]], Z),
	createEmptyRow(Z, Col1, R).


% Adds a full column of [empty, 0] to the end.
addColumnEnd([], []).
addColumnEnd([H|T], [H1|T1]):-
	append(H, [[empty,0]], H1),
	addColumnEnd(T, T1).


% Adds a full column of [empty, 0] to the beginning.
addColumnStart([], []).
addColumnStart([H|T], [H1|T1]):-
	append([[empty,0]], H, H1),
	addColumnStart(T, T1).


% Adds a full row of [empty, 0] in the end
addRowEnd([H|T], Z) :-
	arrayLength(H, Col),
	createEmptyRow([], Col, R),
	append([H|T], [R], Z).


% Adds a full row of [empty, 0] in the start
addRowStart([H|T], Z) :-
	arrayLength(H, Col),
	createEmptyRow([], Col, R),
	append([R], [H|T], Z).


% Replaces an element in a list by another, returning the resulting board
replace([_|T], 0, X, [X|T]).
replace([H|T], I, X, [H|R]) :-
    I > 0,
    I1 is I - 1,
    replace(T, I1, X, R).


% Checks the tile color (2: empty; 1: black; 0: white)
checkPiece(X, Row, Col, Piece) :-
	checkInsideBoard(X, Col, Row, Flag),
	checkPieceAux1(X, Row, Col, Piece, Flag).
checkPieceAux1(X, Row, Col, Piece, 0) :-
	checkPiece1(X, Row, Col, Piece).
checkPieceAux1(_, _, _, Piece, 1) :-
	Piece is 2.
checkPiece1([H|_], 0, Col, Piece):-
	checkPieceAux2(H, Col, Piece).
checkPiece1([_|T], Row, Col, Piece):-
	Row1 is Row-1,
	checkPiece(T, Row1, Col, Piece).
checkPieceAux2([[white|[_|[]]]|_], 0, Piece):-
	Piece is 0.
checkPieceAux2([[black|[_|[]]]|_], 0, Piece):-
	Piece is 1.
checkPieceAux2([[empty|[_|[]]]|_], 0, Piece):-
	Piece is 2.
checkPieceAux2([_|T], Col, Piece):-
	Col1 is Col-1,
	checkPieceAux2(T, Col1, Piece).


% Checks the number of pieces in a certain tile
checkNumber([H|_], 0, Col, Num):-
	checkNumberAux(H, Col, Num).
checkNumber([_|T], Row, Col, Num):-
	Row1 is Row-1,
	checkNumber(T, Row1, Col, Num).
checkNumberAux([[_|[H1|[]]]|_], 0, Num):-
	Num is H1.
checkNumberAux([_|T], Col, Num):-
	Col1 is Col-1,
	checkNumberAux(T, Col1, Num).


% Checks the cases where a piece is outside the board (1: is not inside the board; 0: is inside)
checkInsideBoard([H|T], IndC, IndR, Flag) :-
	arrayLength(H, Col), 
	arrayLength([H|T], Row),
	C is Col - 1,
	R is Row - 1,
	((IndC @> C ; IndR @> R) , Flag is 1;
		((IndC @< 0 ; IndR @< 0) , Flag is 1;
		Flag is 0)
	).

% Prints the winning message
winningMessage:-
    write('__________________________________________________'), nl, nl,
    write('|     Congratulations, you just won the game!     |'), nl,
    write('__________________________________________________'), nl,
    mainMenu.
% Prints the losing message
noPiecesMessage:-
	write('__________________________________________________'), nl, nl,
    write('|No more pieces to play. You just lost the game...|'), nl,
    write('__________________________________________________'), nl.


% Allows the input of a certain row + column. This position should be the stack that will be played
chooseStack(Board, C, R, Player):-
	write('To play'), nl,
	write('Column : '), read(Ctest),
	write('Row    : '), read(Rtest),
	checkStackConditions(Board, Ctest, Rtest, Player, F1),
	chooseStackAux(Board, C, R, Player, F1, Ctest, Rtest).
chooseStackAux(Board, C, R, Player, 1, _, _) :-
	chooseStack(Board, C, R, Player).
chooseStackAux(_, C, R, _, 0, Ctest, Rtest) :-
	C is Ctest, 
	R is Rtest.

% Allows the input of a certain row + column. This position should be the tile that will be played to
chooseWhereToMove(Board, C1, R1, C2, R2, Player):-
	write('Where to play'), nl,
	write('Column : '), read(Ctest),
	write('Row    : '), read(Rtest),
	checkTileConditions(Board, C1, R1, Ctest, Rtest, F1),
	chooseWhereToMoveAux(Board, C1, R1, C2, R2, Player, F1, Ctest, Rtest).
chooseWhereToMoveAux(Board, C1, R1, C2, R2, Player, 1, _, _) :-
	chooseWhereToMove(Board, C1, R1, C2, R2, Player).
chooseWhereToMoveAux(_, _, _, C2, R2, _, 0, Ctest, Rtest) :-
	C2 is Ctest,
	R2 is Rtest.

% Allows the input of a certain number. This number will be the number of pieces that will be played
chooseNumberPieces(Board, C, R, Np, Counter):-
	write('Number of pieces : '), read(Nptest),
	checkNPConditions(Board, R, C, Nptest, F1, Counter),
	chooseNumberPiecesAux(Board, C, R, Np, Counter, F1, Nptest).
chooseNumberPiecesAux(Board, C, R, Np, Counter, 1, _):-
	chooseNumberPieces(Board, C, R, Np, Counter).
chooseNumberPiecesAux(_, _, _, Np, _, 0, Nptest):-
	Np is Nptest.


% Prints the message that is white player turn to player
turn(0) :-
	write('__________________________________________________'), nl, nl,
    write('|              O Player turn to play!             |'),nl,
    write('__________________________________________________'), nl.
% Prints the message that is black player turn to player
turn(1) :-
    write('__________________________________________________'), nl, nl,
   	write('|              X Player turn to play!             |'), nl,
    write('__________________________________________________'), nl.