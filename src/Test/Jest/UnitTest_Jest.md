# Unit Test

## Jest Library

### General cases

1. clear after each

   ``` code
    afterEach(() => {
      jest.clearAllMocks();
    });
   ```

### Form Related

1. checkbox:

    ``` code
        // js:
        this.field.enable();
        this.field.disable();
        // ut:
        expect(component.field.enabled).toBe(true);
        expect(component.field.disabled).toBe(true);
    ```
