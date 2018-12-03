/**
 * MyTube class - Represents a tube (cylinder without bases)
 */
class MyTube extends CGFobject {

    /**
     * @constructor of the cylinder
     *
     * @param scene - The global scene
     * @param base - Radius of the tube's base
     * @param top - Radius of the tube's top
     * @param height - Height of the tube
     * @param slices - Number of slices (vertices) for each stack of the tube
     * @param stacks - Number of stacks of the tube
     */
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.texCoordsAux = [];

        this.initBuffers();
    };

    /**
     * Function that determines each vertice position, indices, normals and texture coordinates
     */
    initBuffers() {

        //Arrays that contain the values needed to the construction of the circle
        this.vertices = [
        ];
        this.indices = [
        ];
        this.normals = [
        ];
        this.texCoords = [
        ];

        // Angle difference between each vertex
        var angle = (2 * Math.PI) / this.slices;
        // Difference between each stack
        var stackSize = this.height / this.stacks;
        // Difference between top and base's radius
        var topBase = this.top-this.base;
        // Difference between top and base's radius for each stack
        var diff = topBase/this.stacks;
        // Normal angle
        var theta = Math.atan(topBase/this.height);
        // A multiplier
        var mult = this.base;

        // for that determines the vertices, normals and texture coordinates values
        for (let k = 0; k <= this.stacks; k++) {
            for (let i = 0; i <= this.slices; i++) {

                let ang1 = Math.cos(i * angle);
                let ang2 = Math.sin(i * angle);

                this.vertices.push(ang1 * mult, ang2* mult, k*stackSize);
                this.normals.push(ang1, ang2, theta);
                this.texCoords.push(i/this.slices, k*stackSize);
            }
            mult = (k+1) * diff + this.base;
        }

        // for that determines the indices
        for (let k = 0; k <= this.stacks; k++) {
            for (let i = 0; i <= this.slices; i++) {

                if(k != 0 && i != 0) {

                    this.indices.push((this.slices+1)*k + i - 1, (this.slices+1)*(k-1) + i - 1, (this.slices+1)*(k-1) + i);
                    this.indices.push((this.slices+1)*k + i - 1, (this.slices+1)*(k-1) + i , (this.slices+1)*k + i);
        
                    if(i == this.slices) {
                        this.indices.push((this.slices+1)*(k-1) + i, (this.slices+1)*(k-1), (this.slices+1)*k + i);
                        this.indices.push((this.slices+1)*k + i, (this.slices+1)*(k-1), (this.slices+1)*k);
                    }
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    };

    update(time){};
};