/**
 * MyWing class - Represents a wing using a patch
 */
class MyWing extends CGFobject {

    /**
     * @constructor of the wing
     *
     * @param scene - The global scene
     */
    constructor(scene) {

        super(scene);

        var npointsU = 3;   // Quantos grupos de control points
        var npointsV = 2;   // Quantos control points em cada grupo
        var npartsU = 20;
        var npartsV = 20;

        var controlpoints = [//y,z,x
                                [
                                    [ -1.0, 3.0, 0.0, 1 ],
                                    [ -1.0, -3.0, 0.0, 1 ]             // pontos colados ao aviao baixo
                                ],
                                [
                                    [ 0, 0.0, 40.0, 0.5 ],         //z neste       //ponta da asa
                                    [ 0, 0.0, 40.0, 0.5 ]                          
                                ],
                                [                           
                                    [ 1.0, -3.0, 0.0, 1 ],               // pontos colados ao aviao cima
                                    [ 1.0, 3.0, 0.0, 1 ]
                                ]
                            ];

        this.wing = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlpoints);
    };

    /**
     * Function that displays the wing
     */
    display() 
    {   
        this.scene.pushMatrix();
            this.wing.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.wing.display();
        this.scene.popMatrix();
    };

    /**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
    updateTex(length_s, length_t){};
};