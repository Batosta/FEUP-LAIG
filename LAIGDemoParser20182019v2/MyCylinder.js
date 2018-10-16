/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    };

    initBuffers() {

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        var angle = (2 * Math.PI) / this.slices;
        var stackSize = this.height / this.stacks;
        var topBase = this.top-this.base;
        var diff = topBase/this.stacks; //Difference from Base to Top for Each Stack
        var theta = Math.atan(topBase/this.height);
        var mult = this.base;

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
};