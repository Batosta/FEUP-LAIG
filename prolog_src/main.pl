:- use_module(library(random)).
:- use_module(library(system)).

:-consult('menu.pl').
:-consult('display.pl').
:-consult('logic.pl').
:-consult('utilities.pl').
:-consult('pc.pl').

% Corresponds to the main function
play :-
	firstMenu.