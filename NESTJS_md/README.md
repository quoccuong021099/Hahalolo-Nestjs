## 8.Guard:

[Những nội dung về Guard](./guard.md)

## 9.Interceptors:

[Những nội dung về Interceptors](./interceptors.md)

## 10.Custom route decorators:

[Những nội dung về Custom route decorators](./custom_route_decorators.md)

## DI và IoC:

Dependency Injection là một dạng design pattern được thiết kế với mục đích ngăn chặn sự phụ thuộc giữa các class, để khiến cho code dễ hiểu hơn, trực quan hơn, nhằm phục vụ cho mục đích bảo trì và nâng cấp code.

Theo Wikipedia:

    "Trong kỹ thuật phần mềm, dependency injection là một kỹ thuật theo đó một đối tượng (hoặc static method) cung cấp các phụ thuộc của đối tượng khác. Một phụ thuộc là một đối tượng có thể được sử dụng (service)."

![img](https://codelearn.io/Media/Default/Users/VuTungMinh/Template/aa.jpeg)

Khi mà class A sử dụng một số chức năng của class B, thì có thể nói là class A có quan hệ phụ thuộc với class B.

Trước khi ta có thể sử dụng method của class khác, ta phải khởi tạo một object của class đấy (hay A cần phải tạo 1 thực thể của B). Vậy ta có thể hiểu, việc chuyển giao nhiệm vụ khởi tạo object đó cho một ai khác và trực tiếp sử dụng các dependency đó được gọi là dependency injection.

Dependency injection (DI) là một kỹ thuật lập trình giúp tách một class độc lập với các biến phụ thuộc. Với lập trình hướng đối tượng, chúng ta hầu như luôn phải làm việc với rất nhiều class trong một chương trình. Các class được liên kết với nhau theo một mối quan hệ nào đó. Dependency là một loại quan hệ giữa 2 class mà trong đó một class hoạt động độc lập và class còn lại phụ thuộc bởi class kia.

chúng ta chỉ thường gặp ba loại Dependency Injection sau:

- Constructor injection: Các dependency (biến phụ thuộc) được cung cấp thông qua constructor (hàm tạo lớp).
- Setter injection: Các dependency (biến phụ thuộc) sẽ được truyền vào 1 class thông qua các setter method (hàm setter).
- Interface injection: Dependency sẽ cung cấp một Interface, trong đó có chứa hàm có tên là Inject. Các client phải triển khai một Interface mà có một setter method dành cho việc nhận dependency và truyền nó vào class thông qua việc gọi hàm Inject của Interface đó.

Vậy cụ thể nhiệm vụ của Dependency Injection là:

- Tạo ra các object.
- Biết được class nào cần những object đấy.
- Cung cấp cho những class đó những object chúng cần.

Dependency Injection có thể được thực hiện dựa trên các quy tắc sau:

- Các class sẽ không phụ thuộc trực tiếp lẫn nhau mà thay vào đó chúng sẽ liên kết với nhau thông qua một Interface hoặc base class (đối với một số ngôn ngữ không hỗ trợ Interface)
- Việc khởi tạo các class sẽ do các Interface quản lí thay vì class phụ thuộc nó
