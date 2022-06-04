import sys
from _typeshed import Self
from types import TracebackType

class Timeout(TimeoutError):
    def __init__(self, lock_file: str) -> None: ...

class _Acquire_ReturnProxy:
    def __init__(self, lock: str) -> None: ...
    def __enter__(self) -> str: ...
    def __exit__(
        self, exc_type: type[BaseException] | None, exc_val: BaseException | None, traceback: TracebackType | None
    ) -> None: ...

class BaseFileLock:
    def __init__(self, lock_file: str, timeout: float | str = ...) -> None: ...
    @property
    def lock_file(self) -> str: ...
    @property
    def timeout(self) -> float: ...
    @timeout.setter
    def timeout(self, value: str | float) -> None: ...  # type: ignore
    @property
    def is_locked(self) -> bool: ...
    def acquire(self, timeout: float | None = ..., poll_intervall: float = ...) -> _Acquire_ReturnProxy: ...
    def release(self, force: bool = ...) -> None: ...
    def __enter__(self: Self) -> Self: ...
    def __exit__(
        self, exc_type: type[BaseException] | None, exc_val: BaseException | None, traceback: TracebackType | None
    ) -> None: ...
    def __del__(self) -> None: ...

class WindowsFileLock(BaseFileLock):
    def _acquire(self) -> None: ...
    def _release(self) -> None: ...

class UnixFileLock(BaseFileLock):
    def _acquire(self) -> None: ...
    def _release(self) -> None: ...

class SoftFileLock(BaseFileLock):
    def _acquire(self) -> None: ...
    def _release(self) -> None: ...

if sys.platform == "win32":
    FileLock = WindowsFileLock
elif sys.platform == "linux" or sys.platform == "darwin":
    FileLock = UnixFileLock
else:
    FileLock = SoftFileLock