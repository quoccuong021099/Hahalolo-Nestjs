========== SINGLETON ==========

# I. Mục lục

1. Singleton Pattern là gì?

2. Tại sao cần dùng Singleton Pattern

3. Làm thế nào để implement Singleton Pattern

4. Có những cách nào để implement Singleton Pattern Liệu có đủ không nhỉ các bạn cùng theo dõi nhé

# II. Nội dung

## 1. Single Pattern là gì?

- Singleton pattern là một design pattern trong số 5 design pattern thuộc nhóm Creational Design Pattern.

- Single Pattern là 1 design pattern mà:

  - Đảm bảo rằng một class chỉ có duy nhất 1 instance (khởi tạo).

  - Và cung cấp một cách toàn cầu để truy cập tới instance đó.

## 2. Tại sao cần dùng Singleton Pattern?

- G iả sử trong ứng dụng có chức năng bật tắt nhạc nền chẳng hạn, khi người dùng mở app thì ứng dụng sẽ tự động mở nhạc nền và nếu người dùng muốn tắt thì phải vào setting trong app để tắt nó, trong setting của app cho phép người dùng quản lí việc mở hay tắt nhạc, và trong trường hợp này bạn sẽ cần sử dụng singleton để quản lí việc này. Chắc chắn bạn phải cần duy nhất 1 instance để có thể ra lệnh bật hay tắt, tại sao ? vì đơn giản bạn không thể tạo 1 instance để mở nhạc rồi sau đó lại tạo 1 instance khác để tắt nhạc, lúc này sẽ có 2 instance được tạo ra, 2 instance này không liên quan đến nhau nên không thể thực hiện thực hiện việc cho nhau được, bạn phải hiểu rằng instance nào bật thì chỉ có instance đó mới được phép tắt nên dẫn đến phải cần 1 instance.

## 3. Làm thế nào để implement Singleton Pattern

- Vậy làm thế nào để có thể implement Singleton Pattern chúng ta cần trả lời 2 câu hỏi.

- Làm sao để 1 class chỉ có thể có duy nhất 1instance? Trả lời:

  - `Private constructor của class đó` để đảm bảo rằng class lớp khác không thể truy cập vào constructor và tạo ra instance mới

  - Tạo một biến private static là thể hiện của class đó để đảm bảo rằng nó là duy nhất và chỉ được tạo ra trong class đó thôi.

- Làm sao để có thể cung cấp một cách toàn cầu để truy cấp tới instance đó. Trả lời:

  - Tạo một `public static menthod trả về instance vừa khởi tạo` bên trên, đây là cách duy nhất để các class khác có thể truy cập vào instance của class này

- Vậy cụ thể có những cách nào để implement Singleton Pattern

## 4. Có những cách nào để implement Singleton Pattern

- [Tham khảo](https://viblo.asia/p/hoc-singleton-pattern-trong-5-phut-4P856goOKY3)
