# Краткая информация обо мне

Я Прокопенко Тихон Александрович студент 2 курса, специальности "Программная инженерия" Белорусско-Российского ВУЗа. Имею средний бал 5.0, живу в 3 общажитии. Музыкант, закончил музыкальную школу, играл в оркестре и сам научился играть на гитаре. Амбасодор гойды в РБ. Опыт работы минимальный. Работал на KWork и помогал брату с большими заказами. Хочу стать backend програмистом. Пробовался на стажировку в innowise но не прошёл по англискому языку.

> Мой дережёр говорит: Кто вспотел - тот хорошо играл

## Навыки

- Языки програмирования: python, C#, js
- Фреймворки: FastApi, Asp.Net
- Системы контроля версий: git
- Системы контейнеризации: Docker

## Пример кода

```
using Application.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Users.Commands.CreateUser;

public record CreateUserCommand : IRequest
{
    public required Guid Id { get; set; }
}

public class CreateUserCommandHandler(IUserRepository repository) : IRequestHandler<CreateUserCommand>
{
    public async Task Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        User user = new(request.Id);
        await repository.AddAsync(user, cancellationToken);
    }
}
```
