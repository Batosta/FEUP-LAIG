/**
 * Animation class - Represents an animation of an object
 */
class Animation{

	/**
     * @constructor of the animation
     *
     */
	constructor(scene, span){

		this.scene = scene;

		this.span = span;
	}

	// Atualizar o estado em função do tempo
	update(currTime){}

	// Aplicar a transformação sobre a matriz de transformações da cena quando adequado.
	apply(currTime){}
};