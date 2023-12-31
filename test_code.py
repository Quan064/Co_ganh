a = [0, 1, 2, 3, 4]
ref_a = a # ref_a là biến tham chiếu của a

copy_a = ref_a.copy() # copy_a là không phải biến tham chiếu của a
ref_a[0] = 9

print(a)
print(ref_a)
print(copy_a)
print()

ref_a = copy_a # ref_a trở thành biến tham chiếu của copy_a

print(ref_a)
print(a)