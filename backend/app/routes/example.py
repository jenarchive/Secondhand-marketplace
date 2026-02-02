"""Module calculate a value"""

# pylint: disable=C0116

def my_function(input_value):
  return 5 * input_value


def main():
    result = my_function(2 )
    print(f"The result is: {result}")

if __name__ == "__main__":
    main()