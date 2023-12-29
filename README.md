## [tensorflowjs](https://js.tensorflow.org/api/latest/?hl=zh-cn&_gl=1*5sba13*_ga*MTY4MzY3NjQxMy4xNzAzMTcwOTUy*_ga_W0YLR4190T*MTcwMzc0NDM4NC4zLjEuMTcwMzc0NDQ5NC4wLjAuMA..#loadLayersModel)
  - 配置环境
  - 设计模型
  - 训练模型,训练结果可能会相互影响。需要不断重复训练
  - 保存模型
  - 使用模型
  - tfhub上的公开模型

## 目录
- 2d
  - [根据2D数据预测](https://codelabs.developers.google.com/codelabs/tfjs-training-regression/index.html?hl=zh-cn#0)
  - 马力与 MPG 之间成反比，也就是说，随着马力越大，汽车耗用一加仑汽油能行使的英里数通常越少
  - 目标是训练一个模型，该模型将获取一个一个数字“马力”，并学习预测一个数字“每加仑的英里数”。这是一对一的映射，将这些样本（马力和 MPG）提供给神经网络，神经网络将通过这些样本学习一个公式（或函数），以预测汽车在指定马力下的 MPG。这种通过从我们提供正确答案的样本来学习的方式称为监督式学习。
  - 使用 tfjs-vis 库监控浏览器内训练

- cnn
  - [CNN（卷积神经网络） 识别手写数字](https://codelabs.developers.google.com/codelabs/tfjs-training-classfication/index.html?hl=zh-cn#0)
  - 需要Nginx服务
  - 构建一个 TensorFlow.js 模型，以使用卷积神经网络识别手写数字。首先，我们将通过让分类器“观察”数千个手写数字图片及其标签来训练分类器。然后，我们会使用模型从未见过的测试数据来评估该分类器的准确性。该任务被视为分类任务，因为我们会训练模型以将类别（出现在图片中的数字）分配给输入图片。我们将通过显示输入的多个示例和正确的输出来训练模型。这称为监督式学习。
  - 机器学习模型是指接受输入并生成输出的算法。使用神经网络时，算法是一组神经元层，其中权重（数字）控制着其输出。训练过程会学习这些权重的理想值。
  - 数据重排很重要，因为在训练期间，数据集通常会被拆分成较小的子集（称为批次），以用于训练模型。借助重排，每个批次可从分布的所有数据中获取各种数据。
- handwriting
  - [手写识别](https://github.com/plter/tfjs_quick_start_course_2020)
- imageClassify
  - [图像识别](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)，使用公开已训练好的模型，[在线示例](https://github.com/tensorflow/tfjs-examples/tree/master/mobilenet)