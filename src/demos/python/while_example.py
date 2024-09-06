spam = 0
while spam < 5:
    print(str(spam) + 'is less than 5')
    spam = spam +1
    if spam == 3:
        continue
    print('spam is ' + str(spam))
    

name = ''
while name != 'Alice':
    print("Please type Alice's name.")
    name = input()
print('Thank you')
