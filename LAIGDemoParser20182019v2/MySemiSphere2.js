/**
 * MySemiSphere2 class - Represents a semi-sphere using a patch
 */
class MySemiSphere2 extends CGFobject {

    /**
     * @constructor of the semi-sphere 2
     *
     * @param scene - The global scene
     */
    constructor(scene) {

        super(scene);

        var npointsU = 4;   // Quantos grupos de control points
        var npointsV = 4;   // Quantos control points em cada grupo
        var npartsU = 20;
        var npartsV = 20;

        var controlpoints = [//y,z,x
                                [
                                    [0.0, 0.0, 1.0, 1 ],
                                    [0.0, 0.0, 1.0, 1/3 ],
                                    [0.0, 0.0, 1.0, 1/3 ],
                                    [0.0, 0.0, 1.0, 1 ]
                                ],
                                [
                                    [2.0, 0.0, 1.0, 1/3 ],
                                    [2.0, 4.0, 1.0, 1/9 ],
                                    [-2.0, 4.0, 1.0, 1/9 ],
                                    [-2.0, 0.0, 1.0, 1/3 ]
                                ],
                                [
                                    [2.0, 0.0, -1.0, 1/3 ],
                                    [2.0, 4.0, -1.0, 1/9 ],
                                    [-2.0, 4.0, -1.0, 1/9 ],
                                    [-2.0, 0.0, -1.0, 1/3 ]
                                ],
                                [
                                    [0.0, 0.0, -1.0, 1 ],
                                    [0.0, 0.0, -1.0, 1/3 ],
                                    [0.0, 0.0, -1.0, 1/3 ],
                                    [0.0, 0.0, -1.0, 1 ]
                                ],
                            ];

        this.semiSphere2 = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlpoints);
    };

    /**
     * Function that displays the semi-sphere 2
     */
    display() 
    {   
        this.scene.pushMatrix();
            this.semiSphere2.display();
        this.scene.popMatrix();
    };

    /**
     * Function that updates the texture coordinates
     * @length_s - The length of the s component on each texture
     * @length_t - The length of the t component on each texture
     */
    updateTex(length_s, length_t){};
};