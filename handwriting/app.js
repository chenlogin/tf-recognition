(function () {
  new Vue({
      el: "#vueapp",

      data: {
          targetNum: 0,
          trainStatus: "",
          result: ""
      },

      mounted() {
          let c2d = this.drawCanvasContext2d = this.$refs.drawCanvas.getContext("2d");
          c2d.lineWidth = 20;
          c2d.lineCap = "round";
          c2d.lineJoin = "round";

          this.previewCanvasContext2d = this.$refs.previewCanvas.getContext("2d");

          this.loadOrCreateModel();
      },


      methods: {

          async loadOrCreateModel() {
              try {
                  // 加载一个由图层对象组成的模型，包括其拓扑和权重。
                  this.model = await tf.loadLayersModel("localstorage://mymodel");
              } catch (e) {
                  console.warn("Can not load model from LocalStorage, so we create a new model");
                  /**
                   * 创建一个顺序模型，其中一层的输出是下一层的输入的任何模型，即模型拓扑是简单的层“堆栈”，没有分支或跳跃。
                   * tf.model() 和 tf.sequential() 之间的主要区别在于 tf.sequential() 不太通用，仅支持线性堆栈。 tf.model() 更通用，支持任意层图（无循环）
                   *
                   * tf.layers.inputLayer({inputShape: [784]}),//创建一个新的输入层，这是神经网络模型的第一层。
                   * 输入层期望一个长度为 784 的一维数组，这在计算机视觉任务中常见，如手写数字识别，其中一张28x28的图像将被拉平成一维数组（28*28=784）
                   *
                   * tf.layers.dense函数是用来创建一个全连接的神经网络层，其中所有的输入都与输出节点相连。
                   * units 参数指定了这一层神经元的数量。在这个例子中，我们有10个神经元，这可能意味着在处理一个10类（例如手写数字0-9）的分类问题。
                   *
                   * tf.layers.softmax在神经网络中，softmax 函数通常用在输出层，用于多分类任务的概率输出，这样可以使得输出的结果更好的反映出其概率含义。
                  */
                  this.model = tf.sequential({
                      layers: [
                          tf.layers.inputLayer({inputShape: [784]}),
                          tf.layers.dense({units: 10}),
                          tf.layers.softmax()
                      ]
                  });
              }

              /**
               * this.model.compile是在机器学习中用于配置训练模型的命令。它接受三个主要参数：
               * 优化器（optimizer）：这是你选择的优化算法，用于改变模型的各种参数以尽可能的减少损失。
               * 损失函数（loss）：这是你试图在优化过程中最小化的函数，用于度量模型的预测和实际结果之间的差距。
               * 指标（metrics）：这是用于评估模型性能的函数。这些函数类似于损失函数，但并不用于训练过程。
               * 
               * this.model.compile通过这三个参数来定义了模型应如何学习。
               * 'SGD' 是 'Stochastic Gradient Descent'（随机梯度下降）的缩写。
               * 在机器学习中，它用于最小化模型的损失函数。它每一次迭代只选取一个随机样本进行权重更新，这样相比于批量梯度下降算法，能够训练得更快，且更新步骤更频繁，有助于模型跳出局部最优解。
               */
              this.model.compile({
                  optimizer: 'sgd',
                  loss: 'categoricalCrossentropy',
                  metrics: ['accuracy']
              });
          },

          canvasMouseDownHandler(e) {
              this.drawing = true;
              this.drawCanvasContext2d.beginPath();
              this.drawCanvasContext2d.moveTo(e.offsetX, e.offsetY);
          },

          canvasMouseMoveHandler(e) {
              if (this.drawing) {
                  this.drawCanvasContext2d.lineTo(e.offsetX, e.offsetY);
                  this.drawCanvasContext2d.stroke();
              }
          },

          canvasMouseUpHandler(e) {
              this.drawing = false;

              this.previewCanvasContext2d.fillStyle = "white";
              this.previewCanvasContext2d.fillRect(0, 0, 28, 28);
              this.previewCanvasContext2d.drawImage(this.$refs.drawCanvas, 0, 0, 28, 28);
          },

          btnClearCanvasClickedHandler(e) {
              this.drawCanvasContext2d.clearRect(0, 0, this.$refs.drawCanvas.width, this.$refs.drawCanvas.height);
          },

          getImageData() {
              // 拷贝画布指定矩形的像素数据
              let imageData = this.previewCanvasContext2d.getImageData(0, 0, 28, 28);

              //归一化，将0-255 转化为 0-1
              let pixelData = [];

              let color;
              for (let i = 0; i < imageData.data.length; i += 4) {
                  color = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                  pixelData.push(Math.round((255 - color) / 255));
              }
              return pixelData;
          },


          async btnTrainClickedHandler(e) {
              let data = this.getImageData();
              console.log(this.targetNum);
              // [1,0,0,0,0,0,0,0,0,0]
              // [0,1,0,0,0,0,0,0,0,0]
              // 在张量中进行 one-hot 编码，该方法将每个类别值转换为一个向量，向量中的所有值都为0，除了该类别的索引，其值是1。
              // 如果你有 5 个类别，第一个类别将被表示为 [1, 0, 0, 0, 0]，第二个类别将被表示为 [0, 1, 0, 0, 0]，以此类推
              let targetTensor = tf.oneHot(parseInt(this.targetNum), 10);

              let self = this;
              console.log("Start training");
              // 将模型训练固定数量的 epoch（数据集上的迭代）
              await this.model.fit(tf.tensor([data]), tf.tensor([targetTensor.arraySync()]), {
                  epochs: 30,
                  callbacks: {
                      onEpochEnd(epoch, logs) {
                          console.log(epoch, logs);
                          self.trainStatus = `<div>Step: ${epoch}</div><div>Loss: ${logs.loss}</div>`;
                      }
                  }
              });
              self.trainStatus = `<div style="color: green;">训练完成</div>`;
              console.log("Completed");
              
              // 保存 LayersModel 的配置和权重
              // 可以保存在浏览器localstorage、DB、.json、http server等
              // https://www.tensorflow.org/js/guide/save_load?hl=zh-cn
              await this.model.save("localstorage://mymodel");
          },

          async btnPredictClickedHandler(e) {
              let data = this.getImageData();
              // 对输入张量执行推理
              let predictions = await this.model.predict(tf.tensor([data]));
              this.result = predictions.argMax(1).arraySync()[0];
          }
      }
  });
})();